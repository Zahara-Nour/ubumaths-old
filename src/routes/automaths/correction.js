import math from 'tinycas'
import { getLogger } from '$lib/utils'
export const STATUS_EMPTY = 'empty'
export const STATUS_CORRECT = 'correct'
export const STATUS_INCORRECT = 'incorrect'
export const STATUS_UNOPTIMAL_FORM = 'unoptimal form'
export const STATUS_BAD_FORM = 'bad form'
export const STATUS_BAD_UNIT = 'bad unit'

let { fail, trace, info } = getLogger('correction', 'info')


// VALIDATION DES REPONSES
// 1) on regarde si il y a eu une réponse -> STATUS_EMPTY
// 2) on regarde si l'expression est valide mathématiquement -> STATUS_INCORRECT
// 3) on regarde si la réponse de l'utilisateur est équivalente à la solution -> STATUS_INCORRECT
// 4) on vérifie les contraintes (options require et no-penalty) :
//   espaces, zéros inutiles, produits implicites, parenthèses superflues,
//   signes superflus, termes nuls, facteurs nuls, facteurs égaux à 1,
//   fractions réduites, unités
//   -> STATUS_BAD_FORM ou STATUS_UNOPTIMAL_FORM
// 5) si la solution n'est pas explicitement calculable un test (testAnswer) de validation 
//    peut être effectué -> STATUS_INCORRECT ou STATUS_CORRECT ou inchangé (peut deja etre STATUS_UNOPTIMAL_FORM ou STATUS_BAD_FORM)
// 6) Sinon après avoir mis en ordre les termes et facteurs, on compare strictement la réponse à la solution explicite -> STATUS_BAD_FORM ou STATUS_CORRECT
// TODO: Formats 

const EMPTY_ANSWER = "Tu n'as rien répondu."
const ZEROS =
    "<span style='color:_COLORANSWER_'>Ta réponse</span> contient un ou des zéros inutiles."
const FACTORE_ONE =
    "Dans <span style='color:_COLORANSWER_'>ta réponse</span>, tu peux enlever un facteur égal à 1."
const FACTORE_ZERO =
    "Tu peux simplifier <span style='color:_COLORANSWER_'>ta réponse</span> qui contient un facteur nul."
const NULL_TERMS =
    "<span style='color:_COLORANSWER_'>Ta réponse</span> contient un terme nul que tu peux enlever."
const BRACKETS =
    "<span style='color:_COLORANSWER_'>Ta réponse</span> contient des parenthèses inutiles."
const BRACKETS_FIRST_TERM =
    "<span style='color:_COLORANSWER_'>Ta réponse</span> contient des parenthèses inutiles en début de somme."
const SPACES =
    "Les chiffres sont mal espacés dans <span style='color:_COLORANSWER_'>ta réponse</span>."
const SIGNS =
    "Tu peux faire des simplifications de signes dans <span style='color:_COLORANSWER_'>ta réponse</span>."
const MATH_INCORRECT =
    "<span style='color:_COLORANSWER_'>Ta réponse</span> n'est pas mathématiquement correcte."
const PRODUCTS =
    "Tu peux simplifier certains symboles de multiplication dans <span style='color:_COLORANSWER_'>ta réponse</span>."
const FRACTIONS =
    "<span style='color:_COLORANSWER_'>Ta réponse</span> contient une ou des fractions non simplifiées."
const BAD_FORM =
    "<span style='color:_COLORANSWER_'>Ta réponse</span> n'est pas écrite sous la forme demandée."

const BAD_UNIT =
    "<span style='color:_COLORANSWER_'>Ta réponse</span> n'est pas écrite avec l'unité demandée."

const TERMS_PERMUTATION =
    "Dans <span style='color:_COLORANSWER_'>ta réponse</span> les termes doivent être écrits dans un certain ordre."

const FACTORS_PERMUTATION =
    "Dans <span style='color:_COLORANSWER_'>ta réponse</span> les facteurs doivent être écrits dans un certain ordre."

const TERMS_FACTORS_PERMUTATION =
    "Dans <span style='color:_COLORANSWER_'>ta réponse</span> les termes et facteurs doivent être écrits dans un certain ordre."

// retourne un tableau des contraintes non respectées
function checkConstraints(item) {

    const checks = [
        {
            option: ['no-penalty-for-incorrect-spaces', 'require-correct-spaces'],
            function: checkSpaces,
            com: SPACES,
            text: 'spaces'
        },
        {
            option: [
                'no-penalty-for-explicit-products',
                'require-implicit-products',
            ],
            function: checkProducts,
            com: PRODUCTS,
            text: 'implicits products'
        },
        {
            option: [
                'no-penalty-for-extraneous-brackets',
                'require-no-extraneaous-brackets',
            ],
            function: checkBrackets,
            com: BRACKETS,
            text: 'extraneous brackets'
        },

        // la vérifiaction pour le premiet terme se fait dans check_brackets

        // {
        //     option: [
        //         'no-penalty-for-extraneous-brackets-in-first-negative-term',
        //         'require-no-extraneaous-brackets',
        //     ],
        //     function: checkBrackets,
        //     com: BRACKETS_FIRST_TERM,
        // },
        {
            option: [
                'no-penalty-for-extraneous-zeros',
                'require-no-extraneaous-zeros',
            ],
            function: checkZeros,
            com: ZEROS,
            text: 'extraneous zeros'
        },
        {
            option: [
                'no-penalty-for-extraneous-signs',
                'require-no-extraneaous-signs',
            ],
            function: checkSigns,
            com: SIGNS,
            text: 'extraneous signs'
        },
        {
            option: ['no-penalty-for-factor-one', 'require-no-factor-one'],
            function: checkFactorsOne,
            com: FACTORE_ONE,
            text: 'factor one'
        },
        {
            option: ['no-penalty-for-factor-zero', 'require-no-factor-zero'],
            function: checkFactorsZero,
            com: FACTORE_ZERO,
            text: 'factor zero'
        },
        {
            option: ['no-penalty-for-null-terms', 'require-no-null-terms'],
            function: checkNullTerms,
            com: NULL_TERMS,
            text: 'null term'
        },
        {
            option: ['no-penalty-for-non-reduced-fractions', 'require-reduced-fractions'],
            function: checkFractions,
            com: FRACTIONS,
            text: 'non reduced fraction'
        },
    ]

    checks.forEach((check) => {
        if (!item.options.includes(check.option[0]) && !check.function(item)) {
            // console.log(check.option[0], 'not passed', item)
            item.coms.push(check.com)
            if (item.options.includes(check.option[1])) {
                item.status = STATUS_BAD_FORM
            } else {
                // penalty = true
                item.unoptimals.push(check.text)
                if (item.status !== STATUS_BAD_FORM) item.status = STATUS_UNOPTIMAL_FORM
            }
        }
    })
}

function checkAnswer(item) {


    if (item.testAnswer) {
        const tests = item.testAnswer.replace(/&answer/g, item.answer).split('&&')
        // console.log('tests', tests)
        const failed = tests.some((test) => math(test).eval().isFalse())

        // TODO : tester les formats

        if (failed) {
            item.status = STATUS_INCORRECT
        } else if (item.status !== STATUS_UNOPTIMAL_FORM && item.status !== STATUS_BAD_FORM) {
            item.status = STATUS_CORRECT
        }
    } else {
        let e = math(item.answer)

        let sols = item.solutions.map((solution) => math(solution))

        // Les tests de contraintes ont été faits. Il faut simplifier la réponse pour pouvoir
        // la comparer à la solution : on enlève les parenthèses inutiles, les signes inutiles....
        e = e
            .removeZerosAndSpaces()
            .reduceFractions()
            .simplifyNullProducts()
            .removeNullTerms()
            .removeFactorsOne()
            .removeSigns()
            .removeUnecessaryBrackets()
            .removeMultOperator()
            
        sols = sols.map((solution) => solution
            .removeZerosAndSpaces()
            .reduceFractions()
            .simplifyNullProducts()
            .removeNullTerms()
            .removeFactorsOne()
            .removeSigns()
            .removeUnecessaryBrackets()
            .removeMultOperator()
        )
        item.cleanedExp = e.string
        item.cleanedSolutions = sols.map(s => s.string)
        // }
        // il reste a tester la permutation des termes et facteurs qui est autorisée par défaut


        const e2 = e.sortTermsAndFactors()
        const sols2 = sols.map((solution) => solution.sortTermsAndFactors())

        // Pourquoi regarder s'il y a une unité ?
        if (!e2.unit && !sols2.some((sol) => sol.strictlyEquals(e2))) {

            item.status = STATUS_BAD_FORM
        }
        else if (item.unit
            && (item.unit === 'HMS' && !e.isTime() || item.unit !== 'HMS' && !e.unit || item.unit !== 'HMS' && e.unit.string !== item.unit)) {
            // console.log("pb unit")
            if (item.options.includes('require-specific-unit')) {
                item.status = STATUS_BAD_UNIT
            }
            else if (!item.options.includes('no-penalty-for-not-respected-unit') && item.status !== STATUS_BAD_FORM) {
                item.unoptimals.push('unit not respected')
                item.status = STATUS_UNOPTIMAL_FORM

            }
        }

        else if (item.options.includes('disallow-terms-and-factors-permutation') ||
            item.options.includes('penalty-for-terms-and-factors-permutation')) {

            if (!sols.some((sol) => sol.strictlyEquals(e))) {
                if (item.options.includes('penalty-for-terms-and-factors-permutation')) {
                    item.unoptimals.push('terms and factors unordered')
                    item.status = STATUS_UNOPTIMAL_FORM
                    item.coms.push(TERMS_FACTORS_PERMUTATION)
                } else {
                    item.status = STATUS_BAD_FORM
                }
            }

        }
        else if (item.options.includes('disallow-terms-permutation') ||
            item.options.includes('penalty-for-terms-permutation')) {
            e = e.sortFactors()
            sols = sols.map((solution) => solution.sortFactors())
            if (!sols.some((sol) => sol.strictlyEquals(e))) {
                if (item.options.includes('penalty-for-terms-permutation')) {
                    item.unoptimals.push('terms unordered')
                    item.status = STATUS_UNOPTIMAL_FORM
                    item.coms.push(TERMS_PERMUTATION)
                } else {
                    item.status = STATUS_BAD_FORM
                }
            }

        }
        else if (item.options.includes('disallow-factors-permutation') ||
            item.options.includes('penalty-for-factors-permutation')) {
            e = e.sortTerms()
            sols = sols.map((solution) => solution.sortTerms())
            if (!sols.some((sol) => sol.strictlyEquals(e))) {
                if (item.options.includes('penalty-for-factors-permutation')) {
                    item.unoptimals.push('factors unordered')
                    item.status = STATUS_UNOPTIMAL_FORM
                    item.coms.push(FACTORS_PERMUTATION)
                } else {
                    item.status = STATUS_BAD_FORM
                }
            }
        }




        // if (
        //     item.options.includes('disallow-terms-and-factors-permutation') ||
        //     item.options.includes('disallow-terms-permutation') ||
        //     item.options.includes('disallow-factors-permutation')
        // ) {
        //     if (
        //         !item.options.includes('disallow-terms-permutation') &&
        //         !item.options.includes('disallow-terms-and-factors-permutation')
        //     ) {
        //         e = e.sortTerms()
        //         sols = sols.map((solution) => solution.sortTerms())
        //     } else if (
        //         !item.options.includes('disallow-factors-permutation') &&
        //         !item.options.includes('disallow-terms-and-factors-permutation')
        //     ) {
        //         e = e.sortFactors()
        //         sols = sols.map((solution) => solution.sortFactors())
        //     }
        // } else {
        //     e = e.sortTermsAndFactors()
        //     sols = sols.map((solution) => solution.sortTermsAndFactors())
        // }


        // if (!sols.some((sol) => sol.strictlyEquals(e))) {
        //     item.status = STATUS_BAD_FORM
        // } else if (item.status !== STATUS_UNOPTIMAL_FORM) {
        //     item.status = STATUS_CORRECT
        // }

        // if (item.status !== STATUS_UNOPTIMAL_FORM && item.status !== STATUS_BAD_FORM && item.status!==) {
        //     item.status = STATUS_CORRECT
        // }

        if (!item.status) {
            item.status = STATUS_CORRECT
        }
    }

    if (item.status === STATUS_BAD_FORM) item.coms.push(BAD_FORM)
    else if (item.status === STATUS_BAD_UNIT) item.coms.push(BAD_UNIT)
}

function checkProducts(item) {
    const e = math(item.answer)
    return e.removeMultOperator().string === e.string
}

function checkFractions(item) {
    const e = math(item.answer)
    return e.reduceFractions().string === e.string
}

function checkNullTerms(item) {
    const e = math(item.answer)
    return e.removeNullTerms().string === e.string
}

function checkBrackets(item) {
    let e
    switch (item.type) {
        case 'trou':
            e = math(item.expression.replace('?', item.answer))

            break
        default:
            e = math(item.answer)
    }
    const allowBracketsInFirstNegativeTerm = item.options.includes('no-penalty-for-extraneous-brackets-in-first-negative-term')
    const check = e.removeUnecessaryBrackets(allowBracketsInFirstNegativeTerm
    )
        .string === e.string
    item.checkBrackets = check
    return check
}

function checkSigns(item) {
    const e1 = math(item.answer)
        .reduceFractions()
        .simplifyNullProducts()
        .removeNullTerms()
        .removeFactorsOne()
        .removeUnecessaryBrackets()
        .removeMultOperator()
        .removeMultOperator()
        .removeUnecessaryBrackets()
        .string
    const e2 = math(item.answer)
        .reduceFractions()
        .simplifyNullProducts()
        .removeNullTerms()
        .removeFactorsOne()
        .removeSigns()
        .removeUnecessaryBrackets()
        .removeMultOperator()
        .string
    // il faut enlever les * inutiles

    return e1 === e2

}

function checkFactorsOne(item) {
    const e = math(item.answer)
    return e.removeFactorsOne().string === e.string
}

function checkFactorsZero(item) {
    const e = math(item.answer)
    return e.simplifyNullProducts().string === e.string
}

// retourne true si la vérification est OK
function checkSpaces(item) {
    //  TODO: a Remplacer par searchMisplacedSpaces
    // la sortie asciimaths du mathfield ne garde pas les espaces
    const a = item.answer_latex.replace(/\\,/g, ' ').replace('{,}', '.').trim()

    const regex = /\d+[\d\s]*(\.[\d\s]*\d+)?/g
    const matches = a.match(regex)

    if (matches) {
        const regexsInt = [
            /\d{4}/,
            /\s$/,
            /\s\d{2}$/,
            /\s\d{2}\s/,
            /\s\d$/,
            /\s\d\s/,
        ]

        const regexsDec = [
            /\d{4}/,
            /^\s/,
            /^\d{2}\s/,
            /\s\d{2}\s/,
            /^\d\s/,
            /\s\d\s/,
        ]
        return !matches.some((match) => {
            let [int, dec] = match.split('.')
            // Dans le cas des entiers, il peut y a voir un espace à la fin,
            // il faut l'enlever
            int = int.trim()

            const result = regexsInt.some((regex) => int.match(regex) ||
                (dec && regexsDec.some((regex) => dec.match(regex))))
            return result
        })
    }

    return true
}

function checkOrder() {
    return true
}

// retourne true si la vérification est OK
function checkZeros(item) {
    return !math(item.answer).searchUnecessaryZeros()
}

export function assessItems(questions, answers, answers_latex, answers_choice, times, classroom) {
    let total = 0
    let score = 0
    const items = []
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i]
        total += question.points
        console.log('question', question)
        items[i] = {
            ...question,
            answer: answers[i],
            answer_latex: answers_latex[i],
            answer_choice: answers_choice[i],
            time: times[i],
            number: i + 1,
        }

        assessItem(items[i], classroom)
        switch (items[i].status) {
            case STATUS_CORRECT:
                score += items[i].points
                break

            case STATUS_UNOPTIMAL_FORM:
                score += items[i].points / 2
                break

            case STATUS_EMPTY:
            case STATUS_BAD_FORM:
            case STATUS_INCORRECT:
                break

            default:
                fail('status not set')
        }
    }
    info('corrected items', items)
    return { items, score, total }
}

export function assessItem(item, classroom = false) {


    item.options = item.options || []
    item.coms = item.coms || []
    if (!item.answer_latex && item.answer) {
        item.answer_latex = item.answer.replace('/ /g', '\\,').replace(',', '{,}').replace('.', '{,}').trim()
    }
    item.unoptimals = []


    if ((item.type === 'choice' && item.answer_choice === null)
        || (item.type !== 'choice' && !item.answer)) {
        //answer_choice peut etre égal à 0
        if (!classroom) item.coms.push(EMPTY_ANSWER)
        item.status = STATUS_EMPTY
    } else {

        switch (item.type) {
            case 'choice':
                item.status =
                    item.solutions.includes(item.answer_choice) === true
                        ? STATUS_CORRECT
                        : STATUS_INCORRECT

                break

            default: {

                let isNotWellFormedExpression

                const expressionFormToBeChecked = item.type === 'trou'
                    ? item.expression.replace('?', item.answer)
                    : item.answer
                isNotWellFormedExpression = math(expressionFormToBeChecked).isIncorrect()


                if (isNotWellFormedExpression) {
                    item.coms.push(MATH_INCORRECT)
                    item.status = STATUS_INCORRECT
                } else {
                    // si i ly a un testAnswer, la validation se fera plus tard
                    // A REVOIR : il n' y a pas de raison de faire intervenir testAnswer ici
                    // il faut juste vérifier que l'on est dans un type de question 'result' ou que la solution est donnée
                    // explicitement dans solutions
                    const equivalent =
                        item.testAnswer ||
                        item.solutions.some((solution) => {
                            return math(item.answer).equals(math(solution))
                        }
                        )

                    // console.log(math(item.solutions[0]).shallow())
                    // console.log(math(item.solutions[0]))
                    if (!equivalent) {
                        item.status = STATUS_INCORRECT
                    } else {
                        // vérification des contraintes de forme
                        checkConstraints(item)
                        if (item.status !== STATUS_BAD_FORM) {
                            checkAnswer(item)
                        }
                    }
                }
            }
        }
    }
}