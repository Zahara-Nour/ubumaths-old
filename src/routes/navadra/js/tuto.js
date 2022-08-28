import {player} from '$lib/navadraStore'
import {get} from 'svelte/store'
import {tuto} from '$lib/navadraState'

let changement
let nouveau_tuteur
let hunter = 'chasseur'
let e = ''
let e_t
let prestigeLastFight
let selectedElementArticle1, selectedElementArticle2, selectedElement
let spellNum
let win

export function tutoriel(etape){
	
    
    let msg
	console.log('tuto', tuto)
	switch(tuto.state.value) {
		case "index_1" :
			switch(etape)	{
				case 1 :
					msg = "Un monstre t'a repéré !<br>Pas le temps de discuter, prépare-toi à défendre chèrement ta vie...";
					break;
			}
			break;
		case "combattre_2" :
			switch(etape)	{
				case 1 :
					msg = "Bon eh bien c'est le moment de vérité comme on dit.<br>Bonne chance et à tout à l'heure... peut-être !";
					break;
			}
			break;
		case "index_3" :
			switch(etape)	{
				case 1 :
					msg = "Pas mal pour un étranger, je ne m'attendais pas à te voir revenir !<br>Ce monstre était particulièremment faible mais ce ne sera pas toujours le cas...";
					break;
				case 2 :
					msg = "Pour te préparer pour tes prochains combats, il est grand temps de commencer ton entraînement.<br>Viens me parler quand tu es prêt"+e+".";
					break;
			}
			break;
		case "accueil_defi_4" :
			if(!changement)	{
				switch(etape)	{
					case 1 :
						msg = "Si tu te sens déjà affuté"+e+" mentalement tu peux directement commencer le défi et sinon, un peu d'entraînement avant ne te fera pas de mal.<br>On y va ?";
						break;
				}
			}
			else if(changement)	{
				switch(etape)	{
					case 1 :
						if(profile.tuteur === "Namuka") 
							{ msg = "QUOI, TU N'AS PAS CHOISI LE FEU ?! C'est un scandale !<br>Je te laisse donc te débrouiller tout"+e+" seul"+e+", ciao !";}
						if(profile.tuteur === "Katillys")
							{ msg = "QUOI, TU N'AS PAS CHOISI L'EAU ?! C'est un scandale !<br>Je te laisse donc te débrouiller tout"+e+" seul"+e+", ciao !";}
						if(profile.tuteur === "Sivem")
							{ msg = "QUOI, TU N'AS PAS CHOISI LE VENT ?! C'est un scandale !<br>Je te laisse donc te débrouiller tout"+e+" seul"+e+", ciao !";}
						if(profile.tuteur === "Leorn")
							{ msg = "QUOI, TU N'AS PAS CHOISI LA TERRE ?! C'est un scandale !<br>Je te laisse donc te débrouiller tout"+e+" seul"+e+", ciao !";}
						break;
					case 2 :
						if(nouveau_tuteur === "Namuka")
							{msg = "Salut "+profile.pseudo+", alors comme ça la magie du Feu t'intéresse ?<br>Je m’appelle Namuka et je suis l’ancienne cheffe de la tribu Shakor, passée maître dans la magie du Feu.";}
						if(nouveau_tuteur === "Katillys")
							{msg = "Salut "+profile.pseudo+", alors comme ça la magie de l'Eau t'intéresse ?<br>Je m’appelle Katillys et je suis une ancienne Membre du Conseil de la tribu des Lyréens, passée maître dans la magie de l’Eau.";}
						if(nouveau_tuteur === "Sivem")
							{msg = "Salut "+profile.pseudo+", alors comme ça la magie du Vent t'intéresse ?<br>Je m’appelle Sivem et je suis l’ancien chef de la tribu des Ataliis, passée maître dans la magie du Vent.";}
						if(nouveau_tuteur === "Leorn")
							{msg = "Salut "+profile.pseudo+", alors comme ça la magie de la Terre t'intéresse ?<br>Je m’appelle Leorn et je suis l’ancien chef de la tribu des Keodenns, passée maître dans la magie de la Terre.";}
						break;
					case 3 :
						msg = "Si tu te sens déjà affuté"+e+" mentalement tu peux directement commencer le défi et sinon, un peu d'entraînement ne te fera pas de mal.<br>On y va ?";
						break;
				}
			}
			break;
		case "fin_defi_5" :
			switch(etape)	{
				case 1 :
					if(profile.pyrs_feu > 0){
						msg = "Tu viens de pratiquer la magie du Feu, tu récoltes donc des Pyrs de Feu (<img class='img_20' src='/webroot/img/icones/pyrs_feu.png' />).<br>C'est grâce à elles que tu vas pouvoir apprendre des sorts de Feu et devenir plus puissant"+e+" !";
					} else if(profile.pyrs_eau > 0){
						msg = "Tu viens de pratiquer la magie de l'Eau, tu récoltes donc des Pyrs d'Eau (<img class='img_20' src='/webroot/img/icones/pyrs_eau.png' />).<br>C'est grâce à elles que tu vas pouvoir apprendre des sorts d'Eau et devenir plus puissant"+e+" !";
					} else if(profile.pyrs_vent > 0){
						msg = "Tu viens de pratiquer la magie du Vent, tu récoltes donc des Pyrs de Vent (<img class='img_20' src='/webroot/img/icones/pyrs_vent.png' />).<br>C'est grâce à elles que tu vas pouvoir apprendre des sorts de Vent et devenir plus puissant"+e+" !";
					} else if(profile.pyrs_terre > 0){
						msg = "Tu viens de pratiquer la magie de la Terre, tu récoltes donc des Pyrs de Terre (<img class='img_20' src='/webroot/img/icones/pyrs_terre.png' />).<br>C'est grâce à elles que tu vas pouvoir apprendre des sorts de Terre et devenir plus puissant"+e+" !";
					}
					break;
				case 2 :
					msg = "Tu t'es montré"+e+" digne d'être un"+e+" vrai"+e+" "+hunter+" de monstres ! Je t'offre donc mon vieux grimoire (<img class='img_20' src='/webroot/img/icones/grimoire_normal.png' />) grâce auquel j'ai appris à maîtriser la magie.";
					break;
			}
			break;
		case "grimoire_6" :
			switch(etape)	{
				case 1 :
					msg = "N'ayant que des Pyrs "+selectedElementArticle1+" pour l'instant, tu dois donc choisir la magie dévastatrice "+selectedElementArticle2+" !";
					break;
				case 2 :
					switch(selectedElement)	{
						case "fire" :
							spellNum = 1;
							break;
						case "water" :
							spellNum = 11;
							break;
						case "wind" :
							spellNum = 15;
							break;
						case "earth" :
							spellNum = 25;
							break;
					}
					msg = "Pour commencer simplement, choisis l'attaque de base "+selectedElementArticle2+" : "+spellNum+".";
					break;
			}
			break;
		case "grimoire_7" :
			switch(etape)	{
				case 1 :
					msg = "Voilà une bonne chose de faite, allons explorer l'île pour se divertir un peu...";
					break;
			}
			break;
		case "index_8" :
			switch(etape)	{
				case 1 :
					msg = "Plutôt que de te cacher dans ton coin en attendant qu'un monstre ne te tombe dessus, je te propose d'aller au devant du danger !";
					break;
				case 2 :
					if(profile.tuteur === "Namuka")
						{msg = "Tiens, regarde moi ce vilain serpent... Il devrait parfaitement faire l'affaire!";}
					if(profile.tuteur === "Katillys")
						{msg = "Tiens, regarde moi ce vilain serpent... Il devrait parfaitement faire l'affaire!";}
					if(profile.tuteur === "Sivem")
						{msg = "Tiens, regarde moi ce vilain serpent... Il devrait parfaitement faire l'affaire!";}
					if(profile.tuteur === "Leorn")
						{msg = "Tiens, regarde moi ce vilain rapace... Il devrait parfaitement faire l'affaire!";}
					break;
			}
			break;
		case "prepa_combats_9" :
			switch(etape)	{
				case 1 :
					msg = "Avant le combat, tu peux voir combien tu gagneras de Prestige (<img class='img_20' src='/webroot/img/icones/prestige.png'/>) si tu gagnes et combien tu en perdras si tu perds.";
					break;
				case 2 :
					msg = "Passons au choix des sorts maintenant.";
					break;
			}
			break;
		case "combats_decks_10" :
			switch(etape)	{
				case 1 :
					msg = "Déplace le sort que tu as appris dans la zone encadrée pour pouvoir l’utiliser en combat.";
					break;
				case 2 :
					msg = "Pour l'instant tu ne connais qu'un sort donc assez discuté et engage le combat !";
					break;
			}
			break;
		case "combattre_11" :
			switch(etape)	{
				case 1 :
					msg = "Prêt"+e+" ? Ah attends, j'ai une vision…<br>Un groupe d'aventuriers est en train de combattre un DRAGON !!!";
					break;
				case 2 :
					msg = "Ça s'annonce EPIQUE, il faut que je voie ça !<br>Désolé"+e_t+" et … bonne chance !";
					break;
			}
			break;
		case "index_12" :
			if(win=="yes"){
				switch(etape)	{
					case 1 :
						msg = "Waouh, tu as gagné ? Incroyable ! Tu viens donc de récolter "+prestigeLastFight+" points de Prestige (<img class='img_20' src='/webroot/img/icones/prestige.png'/>).<br>C'est avec le Prestige que tu gagneras des places dans le classement des chasseurs de monstres.";
						break;
					case 2 :
						msg = "Je te conseille de faire 1 ou 2 défis en plus et apprendre de nouveaux sorts avant de combattre encore mais tu fais comme tu veux...";
						break;
					case 3 :
						msg = "<span class='g'>Une dernière chose</span> : à tout moment, si tu es perdu"+e+" dans Navadra, clique sur la <span class='g'>boussole</span> (<img class='img_20' src='/webroot/img/icones/boussole.png'/>), elle saura te guider sur chaque écran du jeu.";
						break;
				}
			}
			else if(win=="no"){
				switch(etape)	{
					case 1 :
						msg = "Ça arrive même aux meilleurs de se faire mettre K.O par un monstre ! Tu n'as pas gagné de Prestige (<img class='img_20' src='/webroot/img/icones/prestige.png'/>) cette fois ci.<br>C'est avec le Prestige que tu gagneras des places dans le classement des chasseurs de monstres.";
						break;
					case 2 :
						msg = "Je te conseille de faire 1 ou 2 défis en plus et apprendre de nouveaux sorts avant de combattre encore mais tu fais comme tu veux...";
						break;
					case 3 :
						msg = "<span class='g'>Une dernière chose</span> : à tout moment, si tu es perdu"+e+" dans Navadra, clique sur la <span class='g'>boussole</span> (<img class='img_20' src='/webroot/img/icones/boussole.png'/>), elle saura te guider sur chaque écran du jeu.";
						break;
				}
			}
			break;
		}
return msg;
}