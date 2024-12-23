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
app.event(/(.*?)/, async ({ event, client, logger }) => {
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

          const userInfo = await client.users.info({
            user: event.user
          });

          console.log('userInfo', userInfo);

          if (userInfo.ok && userInfo.user) {
            const existingUser = await prisma.user.findFirst({
              where: {
                userId: userInfo.user.id
              }
            });

            if (!existingUser) {
              await prisma.user.create({
                data: {
                  userId: userInfo.user.id,
                  name: userInfo.user.name,
                  realName: userInfo.user.real_name,
                  displayName: userInfo.user.profile?.display_name,
                  firstName: userInfo.user.profile?.first_name,
                  lastName: userInfo.user.profile?.last_name,
                  teamId: userInfo.user.team_id,
                  isAdmin: userInfo.user.is_admin,
                  isOwner: userInfo.user.is_owner,
                  isPrimaryOwner: userInfo.user.is_primary_owner,
                  isRestricted: userInfo.user.is_restricted,
                  isUltraRestricted: userInfo.user.is_ultra_restricted,
                  isBot: userInfo.user.is_bot,
                  updated: userInfo.user.updated,
                  isEmailConfirmed: userInfo.user.is_email_confirmed,
                  whoCanShareContactCard: userInfo.user.who_can_share_contact_card,
                  color: userInfo.user.color,
                  tz: userInfo.user.tz,
                  phone: userInfo.user.profile?.phone,
                  title: userInfo.user.profile?.title,
                  image: userInfo.user.profile?.image_192
                }
              });
            }
          }
          
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
    logger.error('Error handling reaction:', error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('⚡️ Bolt app is running!');
})();