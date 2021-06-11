module.exports = {
    name: `create`,
    description: `create a (voice) channel (under {...}) called {...}`,

    async execute(message, args, config, client) {
        if (!message.guild.member(message.author).hasPermission('MANAGE_CHANNELS')) return message.channel.send(`Sorry, but I can't do that for ya! You don't have permission to manage the channels.`)

        if (args.toLocaleLowerCase().startsWith('a channel')) {
            var cArgs = args.slice(String('a channel').length).trim()
            if (cArgs) {
                if (cArgs.startsWith('called ')) {
                    var cName = ((cArgs.slice(String('called').length).trim()).replace(/[^a-z0-9 _ -]/gi, ''))

                    if (message.channel.parent) {
                        const newChannel = await message.guild.channels.create(cName.toLocaleLowerCase(), {type: 'text', parent: message.channel.parent})
                        message.channel.send({
                            embed: {
                                title: `Created Channel`,
                                description: `Created the channel <#${newChannel.id}> under the "${message.channel.parent.name}" category with synced permissions!\n\nReact to undo.`
                            }
                        }).then((msg) => {
                            msg.react('↩')
                            const filter = (reaction, user) => {
                                return reaction.emoji.name === '↩' && user.id === message.author.id;
                            };
                            
                            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then(async collected => {
                                    
                                    await newChannel.delete()
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
                    } else {
                        const newChannel = await message.guild.channels.create(cName.toLocaleLowerCase(), {type: 'text'})
                        message.channel.send({
                            embed: {
                                title: `Created Channel`,
                                description: `Created the channel <#${newChannel.id}>! Warning: No Category Found!\n\nReact to undo.`
                            }
                        }).then((msg) => {
                            msg.react('↩')
                            const filter = (reaction, user) => {
                                return reaction.emoji.name === '↩' && user.id === message.author.id;
                            };
                            
                            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then(async collected => {
                                    await newChannel.delete()
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

                } else if (cArgs.startsWith('(under ')) {
                    var caName = (cArgs.slice(String('(under').length).trim())
                    var catName = caName.slice(0, caName.search(/[)]/g))

                    cArgs = caName.slice((caName.search(/[)]/g) + 1)).trim()
                    if (cArgs.startsWith('called ')) {
                        var cName = ((cArgs.slice(String('called').length).trim()).replace(/[^a-z0-9 _ -]/gi, ''));

                        var parent = message.guild.channels.cache.find(c => c.name == catName && c.type == "category") || message.guild.channels.cache.find(c => c.id == catName && c.type == "category");
    
                        if (parent) {
                            const newChannel = await message.guild.channels.create(cName.toLocaleLowerCase(), {type: 'text', parent: parent})
                            message.channel.send({
                                embed: {
                                    title: `Created Channel`,
                                    description: `Created the channel <#${newChannel.id}> under the "${parent.name}" category with synced permissions!\n\nReact to undo.`
                                }
                            }).then((msg) => {
                                msg.react('↩')
                                const filter = (reaction, user) => {
                                    return reaction.emoji.name === '↩' && user.id === message.author.id;
                                };
                                
                                msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                    .then(async collected => {
                                        await newChannel.delete()
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
                            
                        } else {
                            parent = await message.guild.channels.create(catName, {type: 'category'})
                            const newChannel = await message.guild.channels.create(cName.toLocaleLowerCase(), {type: 'text', parent: parent})
                            message.channel.send({
                                embed: {
                                    title: `Created Channel`,
                                    description: `Created the voice channel <#${newChannel.id}> and **created a category** called "${parent.name}" with default permissions!\n\n**Not what you wanted?** React to undo.`
                                }
                            })
                            .then((msg) => {
                                msg.react('↩')
                                const filter = (reaction, user) => {
                                    return reaction.emoji.name === '↩' && user.id === message.author.id;
                                };
                                
                                msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                    .then(async collected => {
                                        await parent.delete()
                                        await newChannel.delete()
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
                        message.channel.send(`❌ Use: \`\`\`${config.prefix}create a channel (under Text Channels) called Lounge!\`\`\``)
                    }
                    
                } else {
                    message.channel.send(`❌ Use: \`\`\`${config.prefix}create a channel called Lounge!\`\`\``)
                }
            } else {
                message.channel.send(`❌ Use: \`\`\`${config.prefix}create a channel called Lounge!\`\`\``)
            }
        } else if (args.toLocaleLowerCase().startsWith('a voice channel')) {
            var cArgs = args.slice(String('a voice channel').length).trim()
            if (cArgs) {
                if (cArgs.startsWith('called ')) {
                    var cName = ((cArgs.slice(String('called').length).trim()).replace(/[^a-z0-9 _ -]/gi, ''))

                    if (message.channel.parent) {
                        const newChannel = await message.guild.channels.create(cName, {type: 'voice', parent: message.channel.parent})
                        message.channel.send({
                            embed: {
                                title: `Created Channel`,
                                description: `Created the voice channel <#${newChannel.id}> under the "${message.channel.parent.name}" category with synced permissions!\n\nReact to undo.`
                            }
                        }).then((msg) => {
                            msg.react('↩')
                            const filter = (reaction, user) => {
                                return reaction.emoji.name === '↩' && user.id === message.author.id;
                            };
                            
                            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then(async collected => {
                                    
                                    await newChannel.delete()
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
                    } else {
                        const newChannel = await message.guild.channels.create(cName, {type: 'voice'})
                        message.channel.send({
                            embed: {
                                title: `Created Voice Channel`,
                                description: `Created the voice channel <#${newChannel.id}>! Warning: No Category Found!\n\nReact to undo.`
                            }
                        }).then((msg) => {
                            msg.react('↩')
                            const filter = (reaction, user) => {
                                return reaction.emoji.name === '↩' && user.id === message.author.id;
                            };
                            
                            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then(async collected => {
                                    await newChannel.delete()
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

                } else if (cArgs.startsWith('(under ')) {
                    var caName = (cArgs.slice(String('(under').length).trim())
                    var catName = caName.slice(0, caName.search(/[)]/g))

                    cArgs = caName.slice((caName.search(/[)]/g) + 1)).trim()
                    if (cArgs.startsWith('called ')) {
                        var cName = ((cArgs.slice(String('called').length).trim()).replace(/[^a-z0-9 _ -]/gi, ''));

                        var parent = message.guild.channels.cache.find(c => c.name == catName && c.type == "category") || message.guild.channels.cache.find(c => c.id == catName && c.type == "category");
    
                        if (parent) {
                            const newChannel = await message.guild.channels.create(cName, {type: 'voice', parent: parent})
                            message.channel.send({
                                embed: {
                                    title: `Created Channel`,
                                    description: `Created the voice channel <#${newChannel.id}> under the "${parent.name}" category with synced permissions!\n\nReact to undo.`
                                }
                            }).then((msg) => {
                                msg.react('↩')
                                const filter = (reaction, user) => {
                                    return reaction.emoji.name === '↩' && user.id === message.author.id;
                                };
                                
                                msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                    .then(async collected => {
                                        await newChannel.delete()
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
                        } else {
                            parent = await message.guild.channels.create(catName, {type: 'category'})
                            const newChannel = await message.guild.channels.create(cName, {type: 'voice', parent: parent})
                            message.channel.send({
                                embed: {
                                    title: `Created Voice Channel`,
                                    description: `Created the voice channel <#${newChannel.id}> and **created a category** called "${parent.name}" with default permissions!\n\n**Not what you wanted?** React to undo.`
                                }
                            }).then((msg) => {
                                msg.react('↩')
                                const filter = (reaction, user) => {
                                    return reaction.emoji.name === '↩' && user.id === message.author.id;
                                };
                                
                                msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                    .then(async collected => {
                                        await parent.delete()
                                        await newChannel.delete()
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
                        message.channel.send(`❌ Use: \`\`\`${config.prefix}create a channel (under Text Channels) called Lounge!\`\`\``)
                    }
                    
                } else {
                    message.channel.send(`❌ Use: \`\`\`${config.prefix}create a channel called Lounge!\`\`\``)
                }
            } else {
                message.channel.send(`❌ Use: \`\`\`${config.prefix}create a voice channel called Lounge!\`\`\``)
            }
        }

    }
}