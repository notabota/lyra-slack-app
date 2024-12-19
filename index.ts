import 'dotenv/config'
import { App } from '@slack/bolt';
import { RichTextBlock } from '@slack/types';
import { PrismaClient } from '@prisma/client';
import util from 'util';

const prisma = new PrismaClient();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listen for reactions being added to messages
app.event(/(.*?)/, async ({ event }) => {
  try {
            
    console.log('----------------------------------------');
    console.log(util.inspect(event, false, null, true /* enable colors */))
    console.log('----------------------------------------');

    switch (event.type) {
      case 'message':
        if (!event.subtype) {
    
          await prisma.message.create({
            data: {
              userId: event.user,
              type: event.type,
              timestamp: event.ts,
              text: event.text,
              channelId: event.channel,
              channelType: event.channel_type,
              eventTs: event.event_ts,
              threadTs: event.thread_ts,
              parentId: event.parent_user_id
            }
          });
          
        } else if (event.subtype == 'file_share') {

            const message = await prisma.message.create({
                data: {
                  userId: event.user,
                  type: event.type,
                  timestamp: event.ts,
                  text: event.text,
                  channelId: event.channel,
                  channelType: event.channel_type,
                  eventTs: event.event_ts,
                  threadTs: event.thread_ts,
                  parentId: event.parent_user_id
                }
              });

            if (event.files) {
              for (const file of event.files) {
                await prisma.file.create({
                  data: {
                    fileId: file.id,
                    fileType: file.filetype,
                    name: file.name,
                    title: file.title,
                    pretty_type: file.pretty_type,
                    mimetype: file.mimetype,
                    timestamp: file.created,
                    user: file.user,
                    size: file.size,
                    mode: file.mode,
                    urlPrivate: file.url_private,
                    urlPrivateDownload: file.url_private_download,
                    permalink: file.permalink,
                    message: {
                      connect: {
                        id: message.id
                      }
                    }
                  }
                });
              }
            }
        } else {
            console.log('subtype', event.subtype);
        }
        break;
      
      case 'reaction_added':
        console.log('reaction_added', event);

        const message = await prisma.message.findUnique({
          where: {
            timestamp: event.item.ts
          }
        });

        if (!message) {
          console.log('message not found');
          return;
        }

        await prisma.reaction.create({
          data: {
            userId: event.user,
            reaction: event.reaction,
            itemUser: event.item_user,
            eventTs: event.event_ts,
            message: {
              connect: {
                id: message.id
              }
            }
          }
        });

        break;
    }
    
  } catch (error) {
    console.error('Error handling reaction:', error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('⚡️ Bolt app is running!');
})();