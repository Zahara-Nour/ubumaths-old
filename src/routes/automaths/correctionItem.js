import {
	STATUS_BAD_FORM,
	STATUS_CORRECT,
	STATUS_INCORRECT,
	STATUS_UNOPTIMAL_FORM,
	STATUS_EMPTY,
	STATUS_BAD_UNIT,
} from './correction'
import { correct_color, incorrect_color, unoptimal_color } from '$lib/colors'
import { toMarkup, formatLatex } from '$lib/stores'
import math from 'tinycas'
import { get } from 'svelte/store'

function createSolutionsLatex(item) {
	return item.solutions
		? item.solutions.map((solution) => {
				if (item.type === 'choice') {
					return item.choices[solution]
				} else {
					const e = math(solution)
					return e.type === '!! Error !!' ? solution : e.toLatex()
				}
		  })
		: null
}

export function createCorrection(item) {
	const {
		correction: correction_latex,
		expression_latex,
		expression2_latex,
		solutions,
		answers_latex,
		correctionFormat,
		status,
		choices,
	} = item

	let line
	let lines = []
	let answerColor = correct_color
	if (
		status === STATUS_BAD_FORM ||
		status === STATUS_INCORRECT ||
		status === STATUS_BAD_UNIT
	) {
		answerColor = incorrect_color
	} else if (status === STATUS_UNOPTIMAL_FORM) {
		answerColor = unoptimal_color
	}

	let solutions_latex = createSolutionsLatex(item)

	const regexAnswer = /&answer([1-9]?)/g
	function replaceAnswerCorrect(match, p1) {
		return (
			`<span style="color:${correct_color}; border:2px solid ${correct_color}; border-radius: 5px;  margin:2px; padding:5px;display:inline-block">` +
			(item.type === 'choice'
				? get(formatLatex)(item.choices[item.answers[p1 ? p1 - 1 : 0]].text)
				: get(toMarkup)('$$' + answers_latex[p1 ? p1 - 1 : 0] + '$$')) +
			'</span>'
		)
	}

	const regexAns = /&ans([1-9]?)/g
	function replaceAnsCorrect(match, p1) {
		return (
			`\\enclose{roundedbox}[3px solid ${correct_color}]{\\textcolor{${correct_color}}{` +
			answers_latex[p1 ? p1 - 1 : 0] +
			'}}'
		)
	}

	const regexSolution = /&solution([1-9]?)/g
	function replaceSolution(match, p1) {
		return (
			`<span style="color:${correct_color}; border:2px solid ${correct_color}; border-radius: 5px; margin:2px;padding:5px;display:inline-block">` +
			(item.type === 'choice'
				? get(formatLatex)(item.choices[solutions[p1 ? p1 - 1 : 0]].text)
				: get(toMarkup)(solutions_latex[p1 ? p1 - 1 : 0])) +
			'</span>'
		)
	}

	const regexSol = /&sol([1-9]?)/g
	function replaceSol(match, p1) {
		return item.type === 'choice'
			? item.choices[solutions[p1 ? p1 - 1 : 0]].text
			: `\\enclose{roundedbox}[3px solid ${correct_color}]{\\textcolor{${correct_color}}{` +
					solutions_latex[p1 ? p1 - 1 : 0] +
					'}}'
	}

	function replaceAnswerUncorrect(match, p1) {
		return (
			`<span style="color:${
				item.statuss[p1 ? p1 - 1 : 0] === STATUS_UNOPTIMAL_FORM
					? unoptimal_color
					: incorrect_color
			};display:inline-block">` +
			(item.type === 'choice'
				? get(formatLatex)(item.choices[item.answers[p1 ? p1 - 1 : 0]].text)
				: get(toMarkup)('$$' + answers_latex[p1 ? p1 - 1 : 0] + '$$')) +
			'</span>'
		)
	}

	function replaceAnsUncorrect(match, p1) {
		return (
			`\\textcolor{${
				item.statuss[p1 ? p1 - 1 : 0] === STATUS_UNOPTIMAL_FORM
					? unoptimal_color
					: incorrect_color
			}}{` +
			answers_latex[p1 ? p1 - 1 : 0] +
			'}'
		)
	}

	if (correctionFormat) {
		// la correction
		if (status === STATUS_CORRECT) {
			correctionFormat.correct.forEach((format) => {
				if (format === 'image') {
					let img = choices[solutions[0]].imageBase64
					line = `<img src='${img}' style="max-width:400px;max-height:40vh;" alt='toto'>`
				} else {
					line = format
						.replace(new RegExp('&exp2', 'g'), expression2_latex)
						.replace(new RegExp('&exp', 'g'), expression_latex)
						.replace(regexAnswer, replaceAnswerCorrect)
						.replace(regexAns, replaceAnsCorrect)
				}

				lines.push(line)
			})
		} else {
			correctionFormat.uncorrect.forEach((format) => {
				if (format === 'image') {
					let img = choices[solutions[0]].imageBase64
					line = `<img style="max-width:400px;max-height:40vh;" src='${img}' alt='toto'>`
				} else {
					line = format
						.replace(new RegExp('&exp2', 'g'), expression2_latex)
						.replace(new RegExp('&exp', 'g'), expression_latex)
						.replace(regexSolution, replaceSolution)
						.replace(regexSol, replaceSol)
				}

				lines.push(line)
			})

			// le commentaire avec la réponse de l'utilisateur
			if (status !== STATUS_EMPTY) {
				if (correctionFormat.answer === 'image') {
					let img = choices[answer_choice].imageBase64
					item.coms.unshift(
						`<img src='${img}' style="padding:2px; border: 2px solid ${incorrect_color} ;max-width:400px;max-height:40vh;" alt='toto'>`,
					)
					item.coms.unshift('Ta réponse:')
				} else {
					item.coms.unshift(
						'Ta réponse : ' +
							correctionFormat.answer
								.replace(new RegExp('&exp2', 'g'), expression2_latex)
								.replace(new RegExp('&exp', 'g'), expression_latex)

								.replace(regexAnswer, replaceAnswerUncorrect)
								.replace(regexAns, replaceAnsUncorrect),
					)
				}
			}
		}
	} else {
		switch (item.type) {
			case 'result':
			case 'rewrite': {
				line = `$$\\begin{align*}  ${expression_latex}`
				if (status === STATUS_INCORRECT) {
					line += `&= \\enclose{updiagonalstrike}[3px solid ${incorrect_color}]{${answers_latex[0]}} \\\\`
				} else if (status === STATUS_BAD_FORM || status === STATUS_BAD_UNIT) {
					line += `&= \\textcolor{${incorrect_color}}{${answers_latex[0]}} \\\\`
				} else if (status === STATUS_UNOPTIMAL_FORM) {
					line += `&= \\textcolor{${unoptimal_color}}{${answers_latex[0]}} \\\\`
				}

				line += `&=\\enclose{roundedbox}[2px solid ${correct_color}]{\\textcolor{${correct_color}}{${
					status === STATUS_CORRECT ? answers_latex[0] : solutions_latex[0]
				}}}`

				line += '\\end{align*}$$'
				lines.push(line)

				break
			}

			case 'equation': {
				// let exp = '$$\\begin{align*}x & =5-3 \\\\  & =2\\end{align*}$$'
				line = `La solution de $$${expression_latex}$$ est :`
				lines.push(line)
				line = `$$\\begin{align*}  x`
				if (status === STATUS_EMPTY) {
					line +=
						`=\\textcolor{green}{${solutions_latex[0]}}` + '\\end{align*}$$'
				} else if (status === STATUS_INCORRECT) {
					line +=
						`&= \\enclose{updiagonalstrike}[6px solid rgba(205, 0, 11, .4)]{\\textcolor{red}{${answer_latex}}}` +
						`\\\\&= \\textcolor{green}{${solutions_latex[0]}}\\end{align*}$$`
				} else if (
					status === STATUS_BAD_FORM ||
					status === STATUS_UNOPTIMAL_FORM
				) {
					line +=
						`&= \\textcolor{orange}{${answer_latex}}` +
						`\\\\&= \\textcolor{green}{${solutions_latex[0]}}\\end{align*}$$`
				} else {
					line += `=\\textcolor{green}{${answer_latex}}\\end{align*}$$`
				}
				lines.push(line)

				break
			}
			case 'choice':
				line =
					correction_latex +
					'<span class="green-text">' +
					solutions_latex[0] +
					'</span>'

				lines.push(line)
				break

			case 'decomposition':
				// let exp = '$$\\begin{align*}x & =5-3 \\\\  & =2\\end{align*}$$'

				line = `$$\\begin{align*}  ${expression_latex}`
				if (status === STATUS_EMPTY) {
					line +=
						`=\\textcolor{green}{${solutions_latex[0]}}` + '\\end{align*}$$'
				} else if (status === STATUS_INCORRECT) {
					line +=
						`&= \\enclose{updiagonalstrike}[6px solid rgba(205, 0, 11, .4)]{\\textcolor{red}{${answer_latex}}}` +
						`\\\\&= \\textcolor{green}{${solutions_latex[0]}}\\end{align*}$$`
				} else if (
					status === STATUS_BAD_FORM ||
					status === STATUS_UNOPTIMAL_FORM
				) {
					line +=
						`&= \\textcolor{orange}{${answer_latex}}` +
						`\\\\&= \\textcolor{green}{${solutions_latex[0]}}\\end{align*}$$`
				} else {
					line += `=\\textcolor{green}{${answer_latex}}\\end{align*}$$`
				}
				lines.push(line)
				break

			case 'trou':
				//TODO : empty ?
				if (status === STATUS_CORRECT) {
					line =
						'$$' +
						expression_latex.replace(
							/\\ldots/,
							`\\textcolor{green}{${answers_latex[0]}}`,
						) +
						'$$'
				} else {
					line =
						'$$' +
						expression_latex.replace(
							/\\ldots/,
							`\\textcolor{green}{${solutions_latex[0]}}`,
						) +
						'$$'

					if (status === STATUS_INCORRECT) {
						item.coms.unshift(
							'Ta réponse : $$' +
								expression_latex.replace(
									/\\ldots/,
									`\\textcolor{red}{${answers_latex[0]}}`,
								) +
								'$$',
						)
					} else if (
						status === STATUS_BAD_FORM ||
						status === STATUS_UNOPTIMAL_FORM
					) {
						item.coms.unshift(
							'Ta réponse : $$' +
								expression_latex.replace(
									/\\ldots/,
									`\\textcolor{orange}{${answers_latex[0]}}`,
								) +
								'$$',
						)
					}
				}
				lines.push(line)
		}
	}

	lines = lines.map(get(formatLatex))

	item.coms = item.coms.map((com) =>
		get(formatLatex)(com).replace(/_COLORANSWER_/g, answerColor),
	)

	return lines
}

export function createDetailedCorrection(item) {
	const { expression_latex, expression2_latex, solutions, correctionDetails } =
		item

	let lines = []
	let line
	let solutions_latex = createSolutionsLatex(item)

	correctionDetails.forEach((detail) => {
		if (detail.type === 'image') {
			// le base64 de l'image a été préparé lors de la génération de la question
			let img = detail.base64
			line = `<img src='${img}' style="max-width:400px;max-height:40vh;" alt='toto'>`
		} else {
			line = detail.text
				.replace(new RegExp('&exp2', 'g'), expression2_latex)
				.replace(new RegExp('&exp', 'g'), expression_latex)
				.replace(
					'&solution',
					() =>
						`<span style="color:${correct_color}; border:2px solid ${correct_color}; border-radius: 5px;  margin:2px; padding:5px;display:inline-block">` +
						(item.type === 'choice'
							? get(formatLatex)(item.choices[solutions[0]].text)
							: get(toMarkup)(solutions_latex[0])) +
						'</span>',
				)
				.replace(
					new RegExp('&sol', 'g'),
					item.type === 'choice'
						? item.choices[solutions[0]].text
						: `\\enclose{roundedbox}[3px solid ${correct_color}]{\\textcolor{${correct_color}}{` +
								solutions_latex[0] +
								'}}',
				)
		}
		lines.push(line)
	})
	lines = lines.map(get(formatLatex))
	return lines
}
