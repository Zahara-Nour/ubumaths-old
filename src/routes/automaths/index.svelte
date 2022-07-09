<script>
	import Tab, { Label } from '@smui/tab'
	import TabBar from '@smui/tab-bar'
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion'
	import Badge from '@smui-extra/badge'
	import IconButton, { Icon } from '@smui/icon-button'
	import Fab from '@smui/fab'
	import Select, { Option } from '@smui/select'
	import data, { getQuestion } from './questions'
	import { gradeMatchesClass, grades } from '$lib/grades'
	import generateQuestion from './generateQuestion'
	import Buttons from './Buttons.svelte'
	import Basket from './Basket.svelte'
	import QuestionCard from '$lib/components/QuestionCard.svelte'
	import { fetchImage } from '$lib/images'
	import { goto } from '$app/navigation'
	import { getLogger } from '$lib/utils'
	import { darkmode } from '$lib/stores'

	let { info, fail, warn } = getLogger('Automaths', 'info')
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
	let displayExemple = false
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
		subdomain = subd
		level = l
		generated = generateExemple(theme, domain, subdomain, level)
		if (generated.image) {
			generated.imageBase64P = fetchImage(generated.image)
		}
		if (generated.imageCorrection) {
			generated.imageCorrectionBase64P = fetchImage(generated.imageCorrection)
		}
		if (generated.choices) {
			generated.choices.forEach(async (choice) => {
				if (choice.image) {
					choice.imageBase64P = fetchImage(choice.image)
				}
			})
		}
		// console.log('generated', generated)
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
		// console.log('availables', available)
		return available
	}

	function launchTest() {
		let questions = []
		if (basket.length) {
			questions = basket
		} else {
			const q = getQuestion(theme, domain, subdomain, level)
			questions.push({ id: q.id, count: 10 })
		}

		let href = '/automaths/Test/?questions='
		href += encodeURI(JSON.stringify(questions))
		console.log('classroom', classroom)
		if (classroom) href += '&classroom=true'
		goto(href)
	}
	function fillBasket() {
		addToBasket(theme, domain, subdomain, level, 1)
	}
	function flushBasket() {
		basket = []
	}
	function copyLink() {
		let questions = []
		if (basket.length) {
			questions = basket
		} else {
			const q = getQuestion(theme, domain, subdomain, level)
			questions.push({ id: q.id, count: 10 })
		}

		let href = 'http://localhost:3000/automaths/Test/?questions='
		href += encodeURI(JSON.stringify(questions))
		navigator.clipboard
			.writeText(href)
			.then(function () {
				info('copy test url to clipboard: ', href)
			})
			.catch(function () {
				fail('failed to write exercice url to clipboard')
			})
	}

	function addToBasket(theme, domain, subdomain, level, count, delay) {
		let qs = questions[theme][domain][subdomain]
		const q = qs.find((q) => qs.indexOf(q) + 1 === parseInt(level, 10))
		if (!delay) delay = q.defaultDelay
		const index = basket.findIndex((item) => item.id === q.id)
		if (index !== -1) {
			basket[index].count++
		} else {
			basket = [
				...basket,
				{
					id: q.id,
					count,
					delay,
				},
			]
		}
	}
</script>

<h3>Les automaths !</h3>

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

{#if !showBasket}
	<Select variant="filled" bind:value="{grade}" label="Niveau">
		<Option value="" />
		{#each grades as grade}
			<Option value="{grade}">{grade}</Option>
		{/each}
	</Select>
{/if}

{#if showBasket}
	<!-- {#if isTeacher && showBasket} -->
	<Basket bind:basket addToBasket="{addToBasket}" />
{:else if theme}
	<TabBar tabs="{themes}" let:tab bind:active="{theme}">
		<!-- Note: the `tab` property is required! -->
		<Tab tab="{tab}">
			<Label>{tab}</Label>
		</Tab>
	</TabBar>

	<div class="accordion-container">
		<Accordion>
			{#each Object.keys(availableLevels[theme]) as d}
				<Panel
					bind:open="{panelOpenStatus[d]}"
					on:click="{() => {
						changeDomain(d)
					}}"
				>
					<Header>
						{d}
						<IconButton slot="icon" toggle pressed="{panelOpenStatus[d]}">
							<Icon class="material-icons" on>expand_less</Icon>
							<Icon class="material-icons">expand_more</Icon>
						</IconButton>
					</Header>
					<Content>
						<div class="pl-5">
							{#each Object.keys(availableLevels[theme][d]) as subd}
								<div class="my-5 flex items-center">
									{subd}
									<div flex flex-wrap>
										{#each availableLevels[theme][d][subd] as i}
											{@const q = questions[theme][d][subd][i - 1]}

											<Fab
												class="m-2"
												style="position: relative;"
												color="{domain === d &&
												subdomain === subd &&
												level === i
													? 'primary'
													: 'secondary'}"
												on:click="{(event) => {
													event.stopPropagation()
													changeLevel(subd, i)
												}}"
												mini
											>
												{i}
												<Badge color="custom-green" aria-label="question grade"
													>{q.grade}</Badge
												>
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
	<!-- <div class=" px-2 py-5" style="{'position:sticky; bottom:0; z-index:2;'}"> -->
	<div
		class="flex items-center justify-center py-2"
		style="{`${
			$darkmode ? 'border-radius:5px;background:#fff' : ''
		};position:sticky; bottom:0; z-index:2;`}"
	>
		<div style="{'width:95vw;'}">
			<QuestionCard card="{generated}" flashcard="{true}" showDescription={true} />
		</div>
	</div>
{/if}
