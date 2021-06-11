module.exports = {
    name: `delete`,
    description: `delete [the channel with the id of {...} | this channel]`,

    async execute(message, args, config, client) {
        if (args.toLocaleLowerCase().startsWith('the channel')) {
            var cArgs = args.slice(String('the channel').length).trim()

            if (cArgs) {
                if (cArgs.startsWith('with the id of')) {
                    var cID = message.guild.channels.cache.find(c => c.id == ((cArgs.slice(String('with the id of').length).trim()).replace(/[^a-z0-9 _ -]/gi, ''))); //&& c.type == "category"
                    if (cID) {
                        if (cID.parent) var parent = cID.parent.name; else var parent = "(None)"

                        message.channel.send({
                            embed: {
                                title: `Deleted Channel`,
                                description: `Deleted the ${cID.type} channel titled "${cID.name}" under the "${parent}" category!\n\nReact to undo.`
                            }
                        }).then((msg) => {
                            parent = cID.parent
                            var cName = cID.name
                            var cPermissions = cID.permissionOverwrites
                            var type = cID.type
                            var nsfw = cID.nsfw
                            var rateLimit = cID.rateLimitPerUser
                            var topic = cID.topic
                            var pos = cID.rawPosition


                            cID.delete()
                            msg.react('↩')
                            const filter = (reaction, user) => {
                                return reaction.emoji.name === '↩' && user.id === message.author.id;
                            };
                            
                            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then(async collected => {
                                    msg.edit({
                                        embed: {
                                            title: `Undoing Action...`,
                                        }
                                    })
                                    await message.guild.channels.create(cName, {type: type, permissionOverwrites: cPermissions, parent: parent, nsfw: nsfw, rateLimitPerUser: rateLimit, topic: topic, rawPosition: pos})
                                    msg.edit({
                                        embed: {
                                            title: `Undid Action`,
                                            description: `Action was reverted.`
                                        }
                                    })
                                    msg.react('👍')
                                    return;
                                })
                                .catch(collected => {
                                    return;
                                });
                        })
                    }

                } else {
                    message.channel.send(`❌ Use: \`\`\`Hey JgoChat, delete the channel with the id of ${message.channel.id}!\`\`\``)
                }
            }
        } else if (args.toLocaleLowerCase().trim() == 'this channel') {
            message.channel.send({
                embed: {
                    title: `WARNING: THIS IS UNDOABLE`,
                    description: `Are you sure you wish to delete this channel? 15 seconds to press ✅.`
                }
            }).then((msg) => {
                msg.react('✅')
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅' && user.id === message.author.id;
                };
                
                msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
                    .then(async collected => {
                        msg.edit({
                            embed: {
                                title: `Deleting Channel...`,
                            }
                        })
                        await message.channel.delete()
                        return;
                    })
                    .catch(collected => {
                        return msg.edit({
                            embed: {
                                title: `Cancelled.`,
                            }
                        });
                    });
            })
        }
    }
}