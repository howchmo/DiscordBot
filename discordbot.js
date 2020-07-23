var Discord = require('discord.js');
var auth = require('./auth.json');
var characters = require('./characters.json');
var map = require('./map.json');
var ships = require('./ships.json');
var spacer = "                               ";

function rollD20()
{
	return Math.floor((Math.random()*20)+1);
}

function rollD6()
{
	return Math.floor((Math.random()*6)+1);
}

var attributeLetters = "";
var disciplineLetters = "";
var systemLetters = "";
var departmentLetters = "";
function extractLettersForTaskRolls()
{
	for( var key in map.attributes )
				attributeLetters += key;
	for( var key in map.disciplines )
				disciplineLetters += key;
	for( var key in map.systems )
				systemLetters += key;
	for( var key in map.departments )
				departmentLetters += key;
	console.log(attributeLetters);
	console.log(disciplineLetters);
	console.log(systemLetters);
	console.log(departmentLetters);
}
extractLettersForTaskRolls();

var momentum = 0;
var threat = 0;

const bot = new Discord.Client();
bot.login(auth.token);

bot.on('ready', function (evt)
{
	console.log('Connected');
	console.log('Logged in as: ');
	console.log(bot.user.tag + ' - (' + bot.user.id + ')');
});
bot.on('message', com => {
	var nickname = com.member.displayName;
	var message = com.content;
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
	if (message.substring(0, 1) == '!')
	{
		var msg = "";
		var cmd = "2";
		var args = "";
		if( message.length != 1 )
		{
			args = message.substring(1).split(' ');
			cmd = args[0];
			args = args.splice(1);
		}
		if( cmd.length > 0 )
		{
			if( isNaN(cmd.charAt(0)) )
			{
				if(cmd == "mt" )
				{
					msg = momentum+" momentum, "+threat+" threat";
				}
				else if( cmd.charAt(0) == "m" )
				{
					if( cmd.length == 1 )
					{
						msg = momentum+" momentum";
					}
					else if( cmd.charAt(1) == "=" )
					{
						momentum = Number(cmd.substring(2));
					}
					else if( cmd.charAt(1) == "+" )
					{
						momentum+= Number(cmd.substring(2));
					}
					else if( cmd.charAt(1) == "-" )
					{
						momentum-= Number(cmd.substring(2));
					}
					if( momentum < 0 )
						momentum = 0;
					msg = momentum+" momentum";
				}
				else if( cmd.charAt(0) == "t" )
				{
					if( cmd.length == 1 )
					{
						msg = threat+" threat";
					}
					else if( cmd.charAt(1) == "=" )
					{
						threat = Number(cmd.substring(2));
					}
					else if( cmd.charAt(1) == "+" )
					{
						threat+= Number(cmd.substring(2));
					}
					else if( cmd.charAt(1) == "-" )
					{
						threat-= Number(cmd.substring(2));
					}
					if( threat < 0 )
						threat = 0;
					msg = threat+" threat";
				}
				else if( cmd.charAt(0) == "c" )
				{
					if( cmd.length > 1 )
					{
						msg += "[ ";
						var numberOf6Sided = cmd.substring(1);
						var damages = 0;
						var effects = 0;
						for( i=0; i<numberOf6Sided; i++ )
						{
							if( i != 0 )
							msg += ", ";
							var d = rollD6();
							if( d == 1 )
							{
								damages++;
								msg += ":boom:";
							}
							else if( d == 2 )
							{
								damages+=2;
								msg += ":boom: :boom:";
							}
							else if( d == 3 || d == 4 )
								msg += ":black_large_square:";
							else if( d == 5 || d == 6 )
							{
								effects++;
								damages++;
								msg += ":star:";
							}
						}
						msg += " ]";
					}
					msg += "\n";
					if( damages != undefined && effects != undefined )
					{
						damageString = "damages";
						effectsString = "effects";
						if( damages < 2 )
							damageString = "damage";
						if( effects == 1 )
							effectsString = "effect";
						msg += spacer;
						msg += damages+" "+damageString+", "+effects+" "+effectsString;
					}
				}
				else if( cmd.charAt(0) == "r" )
				{
					if( momentum == 0 )
					{
						msg = "```fix\nYou have no momentum to spend!\n```";
					}
					else
					{
						momentum--;
						msg += "[ ";
						if( cmd.length > 1 )
						{
							for( i=0; i<Number(cmd.charAt(1)); i++ )
							{
								if( i != 0 )
									msg += ", ";
								msg += rollD20();
							}
						}
						else
						{
							msg += rollD20();
						}
						msg += " ]\n";
						msg += spacer;
						msg += momentum+" momentum";
					}
				}
				else if( cmd.charAt(0) == "s" )
				{
					msg += "THE SHIP ROLLS\n"+spacer;
					console.log(cmd.Length);
					if( cmd.length > 1 )
					{
						if( systemLetters.includes(cmd.charAt(1)) )
						{
							// var tag = com.member.user.tag;
							var systemName = map.systems[cmd.charAt(1)];
							var system = ships["ship"].systems[systemName];
							if( departmentLetters.includes(cmd.charAt(2)) )
							{
								var departmentName = map.departments[cmd.charAt(2)];
								var department = ships["ship"].departments[departmentName];
								var op = system+department;
								var focusString = "";
								if( cmd.charAt(3) == "f" || cmd.charAt(3) == "F" )
								{
									op++;
									focusString = " + focus (1)";
								}
								var roll1 = rollD20();
								var roll2 = rollD20();
								var successes = 0;
								var complications = 0;
								if( op > roll1 )
									successes++;
								if( op > roll2 )
									successes++;
								if( roll1 == 1 ) // <= disc )
									successes++;
								if( roll2 == 1 ) // <= disc )
									successes++;
								msg += systemName+" ("+system+") + "+departmentName+" ("+department+")"+focusString+" = "+op;
								msg += "\n";
								msg += spacer;
								msg += "[ "+roll1+", "+roll2+" ]";
								msg += "\n";
								msg += spacer;
								if( successes == 1 )
									msg += successes + " success"; 
								else
									msg += successes + " successes"; 
							}
						}
					}
					else
					{
						msg += "[ "+rollD20()+" ]";
					}
				}
				else if( attributeLetters.includes(cmd.charAt(0)) )
				{
					var tag = com.member.user.tag;
					var attrName = map.attributes[cmd.charAt(0)];
					var attr = characters[tag].attributes[attrName];
					if( disciplineLetters.includes(cmd.charAt(1)) )
					{
						var discName = map.disciplines[cmd.charAt(1)];
						var disc = characters[tag].disciplines[discName];
						var op = attr+disc;
						var focusString = "";
						if( cmd.charAt(2) == "f" || cmd.charAt(2) == "F" )
						{
							op++;
							focusString = " + focus (1)";
						}
						var roll1 = rollD20();
						var roll2 = rollD20();
						var successes = 0;
						var complications = 0;
						if( op > roll1 )
							successes++;
						if( op > roll2 )
							successes++;
						if( roll1 == 1 ) // <= disc )
							successes++;
						if( roll2 == 1 ) // <= disc )
							successes++;
						msg += attrName+" ("+attr+") + "+discName+"("+disc+")"+focusString+" = "+op;
						msg += "\n";
						msg += spacer;
						msg += "[ "+roll1+", "+roll2+" ]";
						msg += "\n";
						msg += spacer;
						if( successes == 1 )
							msg += successes + " success"; 
						else
							msg += successes + " successes"; 
					}
				}
			}
			else
			{
				var numberOf20Sided = cmd.charAt(0);
				msg += "[ ";
				for( i=0; i<numberOf20Sided; i++ )
				{
					if( i != 0 )
					msg += ", ";
					msg += rollD20();
				}
				msg += " ]";
			}
	    com.channel.send(msg);
		}
	}
});

