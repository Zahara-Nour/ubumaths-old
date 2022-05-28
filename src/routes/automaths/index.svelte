<script>
	import Tab, { Label } from '@smui/tab'
	import TabBar from '@smui/tab-bar'
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion'
	import Badge from '@smui-extra/badge'
	import IconButton, { Icon } from '@smui/icon-button'
	import Fab from '@smui/fab'
	import Select, { Option } from '@smui/select'
	import data from './questions'
	import { gradeMatchesClass, grades } from '$lib/grades'
	import Exemple from './Exemple.svelte'
	import generateQuestion from './generateQuestion'
	import Buttons from './Buttons.svelte'

	const questions = data.questions

	let domain
	let subdomain
	let level
	let panelOpenStatus
	let domains = []
	let subdomains = []
	let grade = grades[grades.length - 1]
	let availableLevels
	let themes
	let theme
	let displayExemple = true
	let generated
	let showBasket = false
	let classroom = false
	let basket = []

	$: changeGrade(grade)
	$: changeTheme(theme)
	// $ changeDomain(domain)

	function changeGrade(grade) {
		availableLevels = getAvailablesLevels(grade)
		themes = Object.keys(availableLevels)
		theme = themes[0]
		domains = []
		subdomains = []
	}

	function changeTheme(t) {
		const domains = Object.keys(availableLevels[t])
		if (domains) {
			panelOpenStatus = {}
			domains.forEach((d) => {
				panelOpenStatus[d] = false
			})
			panelOpenStatus[domains[0]] = true
			if (domains.length) {
				changeDomain(domains[0])
			}
		}
	}

	function changeDomain(d) {
		domain = d
		const subdomains = Object.keys(availableLevels[theme][domain])
		if (subdomains && subdomains.length) {
			const subd = subdomains[0]
			if (availableLevels[theme][domain][subd]) {
				const level = availableLevels[theme][domain][subd][0]
				changeLevel(subd, level)
			}
		}
	}

	function changeLevel(subd, l) {
		console.log('changeLevel', subd, l)
		subdomain = subd
		level = l
		generated = generateExemple(theme, domain, subdomain, level)
	}

	function generateExemple(theme, domain, subdomain, level) {
		let qs = questions[theme][domain][subdomain]
		const q = { ...qs.find((q) => qs.indexOf(q) + 1 === parseInt(level, 10)) }
		return generateQuestion(q)
	}

	// suivant le niveau (grade), retourne l'ensemble des levels disponibles par theme/domaine/sous-domaine
	function getAvailablesLevels(grade) {
		const available = {}
		Object.keys(questions).forEach((theme) => {
			available[theme] = {}
			Object.keys(questions[theme]).forEach((domain) => {
				available[theme][domain] = {}
				Object.keys(questions[theme][domain]).forEach((subdomain) => {
					available[theme][domain][subdomain] = []
					questions[theme][domain][subdomain].forEach((q, i) => {
						if (gradeMatchesClass(q.grade, grade)) {
							available[theme][domain][subdomain].push(i + 1)
						}
					})
					if (!available[theme][domain][subdomain].length) {
						delete available[theme][domain][subdomain]
					}
				})
				if (!Object.keys(available[theme][domain]).length) {
					delete available[theme][domain]
				}
			})
			if (!Object.keys(available[theme]).length) {
				delete available[theme]
			}
		})
		console.log('availables', available)
		return available
	}

	function launchTest() {}
	function fillBasket() {}
	function flushBasket() {}
	function copyLink() {}
</script>

{#if theme}
	<h1>Les automaths !</h1>
	<div>
		<span style="position: relative;">
			Text with a badge.
			<Badge aria-label="unread count">3</Badge>
		</span>
	</div>
	<Buttons
		bind:showBasket
		bind:classroom
		bind:displayExemple
		basket="{basket}"
		launchTest="{launchTest}"
		fillBasket="{fillBasket}"
		copyLink="{copyLink}"
		flushBasket="{flushBasket}"
	/>

	<Select variant="filled" bind:value="{grade}" label="Niveau">
		<Option value="" />
		{#each grades as grade}
			<Option value="{grade}">{grade}</Option>
		{/each}
	</Select>

	<TabBar tabs="{themes}" let:tab bind:active="{theme}">
		<!-- Note: the `tab` property is required! -->
		<Tab tab="{tab}">
			<Label>{tab}</Label>
		</Tab>
	</TabBar>

	<div class="accordion-container">
		<Accordion>
			{#each Object.keys(availableLevels[theme]) as domain}
				<Panel
					bind:open="{panelOpenStatus[domain]}"
					on:click="{() => {
						changeDomain(domain)
					}}"
				>
					<Header>
						{domain}
						<IconButton slot="icon" toggle pressed="{panelOpenStatus[domain]}">
							<Icon class="material-icons" on>expand_less</Icon>
							<Icon class="material-icons">expand_more</Icon>
						</IconButton>
					</Header>
					<Content>
						<div class="pl-5">
							{#each Object.keys(availableLevels[theme][domain]) as subd}
								<div class="my-5 flex items-center">
									{subd}
									<div flex flex-wrap>
										{#each availableLevels[theme][domain][subd] as i}
											{@const q = questions[theme][domain][subd][i - 1]}

											<Fab
												class="m-2"
												style="position: relative;"
												on:click="{(event) => {
													event.stopPropagation()
													changeLevel(subd, i)
												}}"
												mini
											>
												{i}
												<Badge color="custom-green" aria-label="new messages count">{q.grade}</Badge>
											</Fab>
										{/each}
									</div>
									<div style="flex-grow:1;"></div>
								</div>
							{/each}
						</div>
					</Content>
				</Panel>
			{/each}
		</Accordion>
	</div>
{/if}

{#if displayExemple}
	<div
		class=" px-2 pt-5 py-5"
		style="{'position:sticky; bottom:0; z-index:2;'}"
	>
		<Exemple question="{generated}" />
	</div>
{/if}
