// =========================================================================
// Discord EC-300 Bot v0.3
// A dumb meme turned into a project that I'm spending way too much time on.
// Coded by: Noah / TheHornist / Lesko Itonula
// =========================================================================

// returns time
function returnTime() {
	let date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	return(hours + ':' + minutes + ':' + seconds);
}

// include discord.io node module and create bot
let Discord = require('discord.io');
let fetch = require('node-fetch');
let discordToken = 'APPTOKENHERE';
let ec300 = new Discord.Client({
	autorun: true,
	token: discordToken
});

// initialize and set game to help command
ec300.on('ready', function(event) {
	console.log(ec300.username + ' standing by to meme');
	ec300.setPresence({game: { name: '!ec300help', type: 0 }});
});

// Message Functions
ec300.on('message', function(user, userID, channelID, message, event) {
	if (userID !== '354832762257145857') {
		// external jams
		if (message.toLowerCase().includes('!jam ') === true ) {
			console.log(user + ' jammed ' + message.replace('!jam ', ''));
			ec300.sendMessage({to: channelID, message: '*engaging...*'});
			setTimeout(function() {
				ec300.sendMessage({
					to: channelID,
					message: message.replace('!jam ', '') + ' ' + returnTime() + ' Combat  You\'re jammed by Hornet EC-300 EC-300-BIGAB - Hornet EC-300'
				});
			}, 1000);
			setTimeout(function() {
				ec300.sendMessage({to: channelID, message: '*returning...*'});
			}, 2000	);
		}
		// self jams
		else if (message.toLowerCase().includes('!jammed') === true) {
			console.log(user + ' jammed themselves');
			ec300.sendMessage({
				to: channelID, 
				message: '<@' + userID + '> ' + returnTime() + ' Combat  You\'re jammed by Hornet EC-300 EC-300-BIGAB - Hornet EC-300'
			});
		}
	
		// testing functions
		if (message.toLowerCase().includes('!test') === true && user === 'thehornist') {
			console.log(user + ' attempted to test');
			ec300.sendMessage({
				to: channelID, 
				message: '<@' + userID + '> hiya!'
			});
			console.log(user + ' tested');
			console.log('user: ' + user + '\nuserID: ' + userID + '\nchannelID: ' + channelID + '\nmessage: ' + message + '\nevent: ' + event)
		}
		else if (message.includes('!test') === true) {
			ec300.sendMessage({
				to: channelID, 
				message: '<@' + userID + '> you are not permitted to use this function.'
			});
		}
		// cross server messaging
		// botspam
/*		else if (message.toLowerCase().includes('!botspam') === true && user === 'thehornist') {
			ec300.sendMessage({
				to: '364526953744564227',
				message: message.replace('!botspam ', '')
			});
		}
		// corp private
		else if (message.toLowerCase().includes('!private') === true && user === 'thehornist') {
			ec300.sendMessage({
				to: '233441425910398976',
				message: message.replace('!private ', '')
			});
		}
		// lobby
		else if (message.toLowerCase().includes('!lobby') === true && user === 'thehornist') {
			ec300.sendMessage({
				to: '233428651708907530',
				message: message.replace('!lobby ', '')
			});
		}*/
	
		// price check the super lazy way
		if (message.toLowerCase().includes('!price ') === true) {
			console.log(user + ' looked for the price of ' + message.replace('!price ',''));
			ec300.sendMessage({
				to: channelID,
				message: 'Help me out broadsidebot,'
			});
			setTimeout(function(){
				ec300.sendMessage({
					to: channelID,
					message: '!getprice ' + message.replace('!price ', '')
				});
			},2000);
			setTimeout(function(){
				ec300.sendMessage({
					to: channelID,
					message: 'Bless :pray:'
				});
			}, 4000);
		}
	
		// char checker
		if (message.toLowerCase().includes('!char') === true) {
			console.log(user + ' checked ' + message.replace('!char ',''));
			fetch('https://esi.tech.ccp.is/latest/search/?categories=character&datasource=tranquility&language=en-us&search='+ message.replace('!char ', '').replace(' ', '%20') +'&strict=true')
			.then(function(res) {
				return res.json();
			})
			.then(function(json) {
				if(json.character === undefined) {
					ec300.sendMessage({
						to: channelID,
						message: 'That character either doesn\'t exist or you mistyped like the idiot you are'
					});
				}
				else {
					ec300.sendMessage({
						to: channelID,
						message: 'that\'s https://zkillboard.com/character/' + json.character + '/ dumb idiot.'
					});
					fetch('https://zkillboard.com/api/stats/characterID/' + json.character + '/')
					.then(function(res) {
						return res.json();
					})
					.then(function(json) {
						if (json.topLists[1].values[0].cticker === undefined) {
							ec300.sendMessage({
								to: channelID,
								message: 'This idiot has been inactive'
							});
						}
						else {
							ec300.sendMessage({
							to: channelID,
							message: 	'```\n' +
										'Corp: [' + json.topLists[1].values[0].cticker + '] ' + json.topLists[1].values[0].corporationName + '\n' +
										'Alliance: [' + json.topLists[2].values[0].aticker + '] ' + json.topLists[2].values[0].allianceName + '\n' +
										'Kills: ' + json.shipsDestroyed + '\n' +
										'Losses: ' + json.shipsLost + '\n' +
										'Kills this week: ' + json.activepvp.kills.count + '\n' +
										'Favorite ships: ' + json.topAllTime[4].data[0].shipName + ' (' + json.topAllTime[4].data[0].kills + ' kills), ' + json.topAllTime[4].data[1].shipName + ' (' + json.topAllTime[4].data[1].kills + ' kills), ' + json.topAllTime[4].data[2].shipName + ' (' + json.topAllTime[4].data[2].kills + ' kills),' + '\n' +
										'```'
							});
						}
					})
					.catch(function(err) {
						console.log(err);
					});
				}
			})
			.catch(function(err) {
				console.log(err);
			});
		}
		// Corp check
		else if (message.toLowerCase().includes('!corp') === true) {
			console.log(user + ' checked ' + message.replace('!corp ', ''))
			fetch('https://esi.tech.ccp.is/latest/search/?categories=corporation&datasource=tranquility&language=en-us&search='+ message.replace('!corp ', '').replace(' ', '%20') +'&strict=true')
			.then(function(res) {
				return res.json()
			})
			.then(function(json) {
				if (json.corporation === undefined) {
					ec300.sendMessage({
						to: channelID,
						message: 'That corporation either doesn\'t exist or you mistyped like the idiot you are'
					});
				}
				else {
					ec300.sendMessage({
						to: channelID,
						message: 'that\'s https://zkillboard.com/corporation/' + json.corporation + '/ dumb idiot.'
					});
					fetch('https://zkillboard.com/api/stats/corporationID/' + json.corporation + '/')
					.then(function(res) {
						return res.json();
					})
					.then(function(json) {
						ec300.sendMessage({
							to: channelID,
							message: 	'```\n' +
										'Member count: ' + json.info.memberCount + '\n' +
										'Total Kills: ' + json.shipsDestroyed + '\n' +
										'Total Losses: ' + json.shipsLost + '\n' +
										'Top Members: ' + 
										'\n  ' +json.topAllTime[0].data[0].characterName + ' (' + json.topAllTime[0].data[0].kills + ' kills)\n' + 
										'  ' + json.topAllTime[0].data[1].characterName + ' (' + json.topAllTime[0].data[1].kills + ' kills)\n' + 
										'  ' + json.topAllTime[0].data[2].characterName + ' (' + json.topAllTime[0].data[2].kills + ' kills)\n' + 
										'  ' + json.topAllTime[0].data[3].characterName + ' (' + json.topAllTime[0].data[3].kills + ' kills)\n' + 
										'  ' + json.topAllTime[0].data[4].characterName + ' (' + json.topAllTime[0].data[4].kills + ' kills)\n' +
										'Active Members This week: ' + json.activepvp.characters.count + '\n' +
										'Kills This Week: ' + json.activepvp.kills.count + '\n' +
										'Top Members This Week:' + 
										'\n  '+ json.topLists[0].values[0].characterName + ' (' + json.topLists[0].values[0].kills + ' kills)\n' + 
										'  ' + json.topLists[0].values[1].characterName + ' (' + json.topLists[0].values[1].kills + ' kills)\n' + 
										'  ' + json.topLists[0].values[2].characterName + ' (' + json.topLists[0].values[2].kills + ' kills)\n' + 
										'  ' + json.topLists[0].values[3].characterName + ' (' + json.topLists[0].values[3].kills + ' kills)\n' +
										'  ' + json.topLists[0].values[4].characterName + ' (' + json.topLists[0].values[4].kills + ' kills)\n' +
										'```'
						});
					})
					.catch(function(err) {
						console.log(err);
					});
				}
			})
			.catch(function(err) {
				console.log(err);
			});
		}
	
		// Doctrine, this will be v big function
		if (message.includes('!doctrine') === true) {
			if (channelID !== '360979523312943106' || channelID !== '364526953744564227' || channelID !== '274708707974053888' || channelID !== '233441425910398976') {
				ec300.sendMessage({
					to: channelID,
					message: '<@' + userID + '> you\'re trying to use an opsec function is a non-opsec channel you fucking mong'
				});
			}
			else {
				if (string.includes('help') === true) {
	
				}
			}
		}
	
		// good ol' EC-300 help
		if (message.includes('!ec300help') === true) {
			console.log(user + ' asked for help');
			ec300.sendMessage({
				to: channelID,
				message: 	'```' +
							'EC-300 Discord bot v0.3\n' +
							'New and improved node.js version!\n' +
							'Blame Lesko for this dumb shit\n\n' +
							'Command prefix: !\n\n' +
							'Command list:\n' +
							'   jammed - jams yourself\n' +
							'   jam [discord user] - jams the user selected\n' +
							'   char [eve character] - brings up zkill and info about a character\n' +
							'   corp [eve corporation] - brings up zkill page of corporation\n' +
							'   ec300help - brings up this text (duh)\n' +
							'   test - a debug function for lesko\n\n' +
							'EC-300 is a work in progress bot with more coming in the future!' +
							'```'
			});
		}
	}
});
