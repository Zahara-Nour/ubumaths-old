import {
	STATUS_BAD_FORM,
	STATUS_CORRECT,
	STATUS_INCORRECT,
	STATUS_UNOPTIMAL_FORM,
	STATUS_EMPTY,
	STATUS_BAD_UNIT,
} from './correction'
import { correct_color, incorrect_color, unoptimal_color } from '$lib/colors'
import { toMarkup } from '$lib/stores'
import math from 'tinycas'
import { get } from 'svelte/store'
import { formatLatex } from '$lib/utils'

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
		answer_latex,
		answer_choice,
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
						.replace(
							'&answer',
							() =>
								'<span style="color:green; border:2px solid green; border-radius: 5px;  margin:2px; padding:5px;display:inline-block">' +
								(item.type === 'choice'
									? get(toMarkup)(item.choices[answer_choice].text)
									: get(toMarkup)('$$' + answer_latex + '$$')) +
								'</span>',
						)
						.replace(
							new RegExp('&ans', 'g'),
							'\\enclose{roundedbox}[3px solid green]{\\textcolor{green}{' +
								answer_latex +
								'}}',
						)
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
						.replace(
							'&solution',
							() =>
								'<span style="color:green; border:2px solid green; border-radius: 5px; margin:2px;padding:5px;display:inline-block">' +
								(item.type === 'choice'
									? get(toMarkup)(item.choices[solutions[0]].text)
									: get(toMarkup)('$$' + solutions_latex[0] + '$$')) +
								'</span>',
						)
						.replace(
							new RegExp('&sol', 'g'),
							item.type === 'choice'
								? item.choices[solutions[0]].text
								: '\\enclose{roundedbox}[3px solid green]{\\textcolor{green}{' +
										solutions_latex[0] +
										'}}',
						)
				}

				lines.push(line)
			})

			// le commentaire avec la réponse de l'utilisateur
			if (status !== STATUS_EMPTY) {
				if (correctionFormat.answer === 'image') {
					let img = choices[answer_choice].imageBase64
					item.coms.unshift(
						`<img src='${img}' style="padding:2px; border: 2px solid red ;max-width:400px;max-height:40vh;" alt='toto'>`,
					)
					item.coms.unshift('Ta réponse:')
				} else {
					item.coms.unshift(
						'Ta réponse : ' +
							correctionFormat.answer
								.replace(new RegExp('&exp2', 'g'), expression2_latex)
								.replace(new RegExp('&exp', 'g'), expression_latex)

								.replace(
									'&answer',
									() =>
										`<span style="color:${answerColor};display:inline-block">` +
										(item.type === 'choice'
											? get(toMarkup)(item.choices[answer_choice].text)
											: get(toMarkup)('$$' + answer_latex + '$$')) +
										'</span>',
								)
								.replace(
									new RegExp('&ans', 'g'),
									`\\textcolor{${answerColor}}{` + answer_latex + '}',
								),
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
					line += `&= \\enclose{updiagonalstrike}[3px solid red]{${answer_latex}} \\\\`
				} else if (status === STATUS_BAD_FORM || status === STATUS_BAD_UNIT) {
					line += `&= \\textcolor{${incorrect_color}}{${answer_latex}} \\\\`
				} else if (status === STATUS_UNOPTIMAL_FORM) {
					line += `&= \\textcolor{${unoptimal_color}}{${answer_latex}} \\\\`
				}

				line += `&=\\enclose{roundedbox}[2px solid ${correct_color}]{\\textcolor{${correct_color}}{${
					status === STATUS_CORRECT ? answer_latex : solutions_latex[0]
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
							`\\textcolor{green}{${answer_latex}}`,
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
									`\\textcolor{red}{${answer_latex}}`,
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
									`\\textcolor{orange}{${answer_latex}}`,
								) +
								'$$',
						)
					}
				}
				lines.push(line)
		}
	}

	lines = lines.map(formatLatex)

	item.coms = item.coms.map((com) =>
		formatLatex(com).replace(/_COLORANSWER_/g, answerColor),
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
						'<span style="color:green; border:2px solid green; border-radius: 5px;  margin:2px; padding:5px;display:inline-block">' +
						(item.type === 'choice'
							? get(toMarkup)(item.choices[solutions[0]].text)
							: get(toMarkup)('$$' + solutions_latex[0] + '$$')) +
						'</span>',
				)
				.replace(
					new RegExp('&sol', 'g'),
					item.type === 'choice'
						? item.choices[solutions[0]].text
						: '\\enclose{roundedbox}[3px solid green]{\\textcolor{green}{' +
								solutions_latex[0] +
								'}}',
				)
		}
		lines.push(line)
	})
	lines = lines.map((line) => formatLatex(line))
	return lines
}
