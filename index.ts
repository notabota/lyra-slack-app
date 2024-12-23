import 'dotenv/config'
import { App } from '@slack/bolt';
import { PrismaClient } from '@prisma/client';
import util from 'util';

const prisma = new PrismaClient();

async function getOrCreateUser(client: any, userId: string) {
  const userInfo = await client.users.info({ user: userId });
  console.log('userInfo', userInfo);
  
  if (!userInfo.ok || !userInfo.user) {
    throw new Error('Failed to fetch user info');
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      userId: userInfo.user.id
    }
  });

  if (existingUser) {
    return existingUser;
  }

  return await prisma.user.create({
    data: {
      userId: userInfo.user.id!,
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

async function getOrCreateChannel(client: any, channelId: string) {
  const channelInfo = await client.conversations.info({ channel: channelId });
  console.log('channelInfo', channelInfo);

  if (!channelInfo.ok || !channelInfo.channel) {
    throw new Error('Failed to fetch channel info');
  }

  const existingChannel = await prisma.channel.findFirst({
    where: {
      channelId: channelInfo.channel.id
    }
  });

  if (existingChannel) {
    return existingChannel;
  }

  return await prisma.channel.create({
    data: {
      channelId: channelInfo.channel.id,
      name: channelInfo.channel.name,
      creator: channelInfo.channel.creator,
      lastRead: channelInfo.channel.last_read,
      isChannel: channelInfo.channel.is_channel,
      isGroup: channelInfo.channel.is_group,
      isIm: channelInfo.channel.is_im,
      isMpim: channelInfo.channel.is_mpim,
      isPrivate: channelInfo.channel.is_private,
      isArchived: channelInfo.channel.is_archived,
      isGeneral: channelInfo.channel.is_general,
      isShared: channelInfo.channel.is_shared,
      isOrgShared: channelInfo.channel.is_org_shared,
      contextTeamId: channelInfo.channel.context_team_id,
      updated: channelInfo.channel.updated
    }
  });
}


const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.event(/(.*?)/, async ({ event, client, logger }) => {
  try {
    console.log('----------------------------------------');
    console.log(util.inspect(event, false, null, true /* enable colors */))
    console.log('----------------------------------------');

    switch (event.type) {
      case 'message':

        if (!event.subtype) {
          const user = await getOrCreateUser(client, event.user);
          const channel = await getOrCreateChannel(client, event.channel);
          await prisma.message.create({
            data: {
              user: {
                connect: {
                  id: user.id
                }
              },
              type: event.type,
              timestamp: event.ts,
              text: event.text,
              channel: {
                connect: {
                  id: channel.id
                }
              },
              channelType: event.channel_type,
              eventTs: event.event_ts,
              threadTs: event.thread_ts,
              parentId: event.parent_user_id
            }
          });

        } else if (event.subtype == 'file_share') {
          const user = await getOrCreateUser(client, event.user);
          const channel = await getOrCreateChannel(client, event.channel);

          const message = await prisma.message.create({
            data: {
              user: {
                connect: {
                  id: user.id
                }
              },
              type: event.type,
              timestamp: event.ts,
              text: event.text,
              channel: {
                connect: {
                  id: channel.id
                }
              },
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
                  user: {
                    connect: {
                      id: user.id
                    }
                  },
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

        const user = await getOrCreateUser(client, event.user);

        await prisma.reaction.create({
          data: {
            user: {
              connect: {
                id: user.id
              }
            },
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
  await app.start(process.env.PORT || 3000);
  app.logger.info('⚡️ Bolt app is running!');
})();