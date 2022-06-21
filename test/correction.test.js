import {beforeEach, describe, expect, it, vi, test} from 'vitest';

import { assessItem, STATUS_BAD_FORM, STATUS_BAD_UNIT, STATUS_CORRECT, STATUS_EMPTY, STATUS_INCORRECT, STATUS_UNOPTIMAL_FORM } from '../src/routes/automaths/correction'
import generateQuestion from '../src/routes/automaths/generateQuestion'

describe('testing empty answer', () => {
    const specs = [[
        {
            expressions: ['1+2'],
        },
        {
            answer: '',
            check_status: STATUS_EMPTY
        },
    ],
    [
        {
            choices: [],
        },
        {
            answer_choice: null,
            check_status: STATUS_EMPTY
        }
    ]]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }

        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer (no unit)', () => {
    const specs = [[
        {
            expressions: ['2+3'],
        },
        {
            answer: '5',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['2,3'],
            'result-type': 'decimal',
        },
        {
            answer: '2,3',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['1,2'],
        },
        {
            answer: '6/5',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            choices: [['oui', 'non']],
            solutions: [[0]],
        },
        {
            answer_choice: 0,
            check_status: STATUS_CORRECT
        }
    ]]

    test.each(specs)('', (q, check) => {
        let answer_choice_text
        let new_answer_choice

        const generated = generateQuestion(q)
        if (q.choices) {
            answer_choice_text = q.choices[0][check.answer_choice]
            new_answer_choice = generated.choices.indexOf(answer_choice_text)
            check.answer_choice = new_answer_choice
        }
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer (with same unit)', () => {
    const specs = [[
        {
            expressions: ['2 cm + 3 cm'],
        },
        {
            answer: '5 cm',
            check_status: STATUS_CORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }

        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer (with different unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
        },
        {
            answer: '500 cm',
            check_status: STATUS_CORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})



describe('testing incorrect answer', () => {
    const specs = [[
        {
            expressions: ['3+4'],
        },
        {
            answer: '6',
            check_status: STATUS_INCORRECT
        },
    ],
    [
        {
            choices: [['oui', 'non']],
            solutions: [[0]],
        },
        {
            answer_choice: 1,
            check_status: STATUS_INCORRECT
        }
    ]]

    test.each(specs)('', (q, check) => {
        let answer_choice_text
        let new_answer_choice

        const generated = generateQuestion(q)
        if (q.choices) {
            answer_choice_text = q.choices[0][check.answer_choice]
            new_answer_choice = generated.choices.indexOf(answer_choice_text)
            check.answer_choice = new_answer_choice
        }
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer (with unit)', () => {
    const specs = [[
        {
            expressions: ['2 cm + 3 cm'],
        },
        {
            answer: '6 cm',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer (incorrect unit)', () => {
    const specs = [[
        {
            expressions: ['2 cm + 3 cm'],
        },
        {
            answer: '5 m',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer (forgotten unit)', () => {
    const specs = [[
        {
            expressions: ['2 cm + 3 cm'],
        },
        {
            answer: '5',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})




describe('testing correct answer with specified unit (require-specific-unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['require-specific-unit']
        },
        {
            answer: '5m',
            check_status: STATUS_CORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer with specified unit (require-specific-unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['require-specific-unit']
        },
        {
            answer: '6m',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer with specified unit (require-specific-unit) (2)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['require-specific-unit']
        },
        {
            answer: '5 cm',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing forgotten unit answer with specified unit (require-specific-unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['require-specific-unit']
        },
        {
            answer: '5',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing bad unit answer with specified unit (require-specific-unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['require-specific-unit']
        },
        {
            answer: '500 cm',
            check_status: STATUS_BAD_UNIT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})





describe('testing correct answer with specified unit (no-penalty-for-not-respected-unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['no-penalty-for-not-respected-unit']
        },
        {
            answer: '5m',
            check_status: STATUS_CORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer with specified unit (no-penalty-for-not-respected-unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['no-penalty-for-not-respected-unit']
        },
        {
            answer: '6m',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer with specified unit (no-penalty-for-not-respected-unit) (2)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['no-penalty-for-not-respected-unit']
        },
        {
            answer: '5 cm',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing forgotten unit answer with specified unit (no-penalty-for-not-respected-unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['no-penalty-for-not-respected-unit']
        },
        {
            answer: '5',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing bad unit answer with specified unit (no-penalty-for-not-respected-unit)', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
            options: ['no-penalty-for-not-respected-unit']
        },
        {
            answer: '500 cm',
            check_status: STATUS_CORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})





describe('testing correct answer with specified unit', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
        },
        {
            answer: '5m',
            check_status: STATUS_CORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer with specified unit', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
        },
        {
            answer: '6m',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing forgotten unit answer with specified unit', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
        },
        {
            answer: '5',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing incorrect answer with specified unit', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
        },
        {
            answer: '5 cm',
            check_status: STATUS_INCORRECT
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing bad unit answer with specified unit', () => {
    const specs = [[
        {
            expressions: ['2 m + 3 m'],
            unit: 'm',
        },
        {
            answer: '500 cm',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ],
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})





describe('testing correct answer with extraneous zeros (require-no-extraneaous-zeros)', () => {
    const specs = [[
        {
            expressions: ['2+3'],
            options: ['require-no-extraneaous-zeros']
        },
        {
            answer: '5,0',
            check_status: STATUS_BAD_FORM
        },
    ],
    [
        {
            expressions: ['5,1'],
            options: ['require-no-extraneaous-zeros']
        },
        {
            answer: '5,10',
            check_status: STATUS_BAD_FORM
        },
    ],
    [
        {
            expressions: ['2+3'],
            options: ['require-no-extraneaous-zeros']
        },
        {
            answer: '05',
            check_status: STATUS_BAD_FORM
        },
    ]
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with extraneous zeros (no-penalty-for-extraneous-zeros)', () => {
    const specs = [[
        {
            expressions: ['2+3'],
            options: ['no-penalty-for-extraneous-zeros']
        },
        {
            answer: '5,0',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['2+3'],
            options: ['no-penalty-for-extraneous-zeros']
        },
        {
            answer: '05',
            check_status: STATUS_CORRECT
        },
    ]
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with extraneous zeros', () => {
    const specs = [[
        {
            expressions: ['2+3'],
        },
        {
            answer: '5,0',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ],
    [
        {
            expressions: ['2+3'],
        },
        {
            answer: '05',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ]
    ]

    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})




describe('testing correct answer with extraneous brackets (require-no-extraneaous-brackets)', () => {
    const specs = [
        [
            {
                expressions: ['2+3'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(5)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['-2+a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(-2)+a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a-(c+d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a-((c+d))',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a+(c+d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a+(c+d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(a+c)+d'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a+c)+d',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a+(c-d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a+(c-d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(a-c)+d'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a-c)+d',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a+(c*d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a+(c*d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c*d)+a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c*d)+a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a+(c:d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a+(c:d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c:d)+a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c:d)+a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a+(c/d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a+(c/d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c/d)+a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c/d)+a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a+(c^d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a+(c^d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c^d)+a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c^d)+a',
                check_status: STATUS_BAD_FORM
            },
        ],



        [
            {
                expressions: ['(a+c)-d'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a+c)-d',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(a-c)-d'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a-c)-d',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a-(c*d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a-(c*d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c*d)-a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c*d)-a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a-(c:d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a-(c:d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c:d)-a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c:d)-a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a-(c/d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a-(c/d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c/d)-a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c/d)-a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a-(c^d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a-(c^d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c^d)-a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c^d)-a',
                check_status: STATUS_BAD_FORM
            },
        ],




        [
            {
                expressions: ['a*(c*d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a*(c*d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c*d)*a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c*d)*a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a*(c:d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a*(c:d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c:d)*a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c:d)*a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a*(c/d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a*(c/d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c/d)*a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c/d)*a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a*(c^d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a*(c^d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c^d)*a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c^d)*a',
                check_status: STATUS_BAD_FORM
            },
        ],




        [
            {
                expressions: ['(c*d):a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c*d):a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c:d):a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c:d):a',
                check_status: STATUS_BAD_FORM
            },
        ],

        [
            {
                expressions: ['(c/d):a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c/d):a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a:(c^d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a:(c^d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c^d):a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c^d):a',
                check_status: STATUS_BAD_FORM
            },
        ],



        [
            {
                expressions: ['(c*d)/a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c*d)/a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c:d)/a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c:d)/a',
                check_status: STATUS_BAD_FORM
            },
        ],

        [
            {
                expressions: ['(c/d)/a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c/d)/a',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a/(c^d)'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a/(c^d)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['(c^d)/a'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(c^d)/a',
                check_status: STATUS_BAD_FORM
            },
        ],


        [
            {
                expressions: ['a/b'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a)/b',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a/b'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a/(b)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a/b'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a)/(b)',
                check_status: STATUS_BAD_FORM
            },
        ],

        [
            {
                expressions: ['{a+b}/b'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a+b)/b',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a/{a+b}'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a/(a+b)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['{a+b}/{a+b}'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a+b)/(a+b)',
                check_status: STATUS_BAD_FORM
            },
        ],


        [
            {
                expressions: ['a^b'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a^(b)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a^b'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a)^b',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a^b'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: '(a)^(b)',
                check_status: STATUS_BAD_FORM
            },
        ],
        [
            {
                expressions: ['a^{a+b}'],
                options: ['require-no-extraneaous-brackets']
            },
            {
                answer: 'a^(a+b)',
                check_status: STATUS_BAD_FORM
            },
        ],

    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with extraneous brackets (no-penalty-for-extraneous-brackets)', () => {
    const specs = [
        ['2+3',
            {
                expressions: ['2+3'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(5)',
                check_status: STATUS_CORRECT
            },
        ],
        ['-2+a',
            {
                expressions: ['-2+a'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(-2)+a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a-(c+d)',
            {
                expressions: ['a-(c+d)'],
                solutions: [['a-(c+d)']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a-((c+d))',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+c+d',
            {
                expressions: ['a+c+d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a+(c+d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+c+d',
            {
                expressions: ['a+c+d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a+c)+d',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+c-d',
            {
                expressions: ['a+c-d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a+(c-d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['a-c+d',
            {
                expressions: ['a-c+d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a-c)+d',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+c*d',
            {
                expressions: ['a+c*d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a+(cd)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c*d+a',
            {
                expressions: ['c*d+a'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(cd)+a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+c:d',
            {
                expressions: ['a+c:d'],
                solutions: [['a+c:d']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a+(c:d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c:d+a',
            {
                expressions: ['c:d+a'],
                solutions: [['c:d+a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c:d)+a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+c/d',
            {
                expressions: ['a+c/d'],
                solutions: [['a+c/d']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a+(c/d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c/d+a',
            {
                expressions: ['c/d+a'],
                solutions: [['c/d+a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c/d)+a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+c^d',
            {
                expressions: ['a+c^d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a+(c^d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c^d+a',
            {
                expressions: ['c^d+a'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c^d)+a',
                check_status: STATUS_CORRECT
            },
        ],



        ['a+c-d',
            {
                expressions: ['a+c-d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a+c)-d',
                check_status: STATUS_CORRECT
            },
        ],
        ['a-c-d',
            {
                expressions: ['a-c-d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a-c)-d',
                check_status: STATUS_CORRECT
            },
        ],
        ['a-c*d',
            {
                expressions: ['a-c*d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a-(cd)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c*d-a',
            {
                expressions: ['c*d-a'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(cd)-a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a-c:d',
            {
                expressions: ['a-c:d'],
                solutions: [['a-c:d']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a-(c:d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c:d-a',
            {
                expressions: ['c:d-a'],
                solutions: [['c:d-a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c:d)-a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a-c/d',
            {
                expressions: ['a-c/d'],
                solutions: [['a-c/d']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a-(c/d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c/d-a',
            {
                expressions: ['c/d-a'],
                solutions: [['c/d-a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c/d)-a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a-c^d',
            {
                expressions: ['a-c^d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a-(c^d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c^d-a',
            {
                expressions: ['c^d-a'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c^d)-a',
                check_status: STATUS_CORRECT
            },
        ],




        ['a*c*d',
            {
                expressions: ['a*c*d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a(cd)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c*d*a',
            {
                expressions: ['c*d*a'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(cd)a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a*c:d',
            {
                expressions: ['a*c:d'],
                solutions: [['a*c:d']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a(c:d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c:d*a',
            {
                expressions: ['c:d*a'],
                solutions: [['c:d*a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c:d)a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a*c/d',
            {
                expressions: ['a*c/d'],
                solutions: [['a*c/d']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a(c/d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c/d*a',
            {
                expressions: ['c/d*a'],
                solutions: [['c/d*a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c/d)a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a*c^d',
            {
                expressions: ['a*c^d'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a(c^d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c^d*a',
            {
                expressions: ['c^d*a'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c^d)a',
                check_status: STATUS_CORRECT
            },
        ],




        ['c*d:a',
            {
                expressions: ['c*d:a'],
                solutions: [['c*d:a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(cd):a',
                check_status: STATUS_CORRECT
            },
        ],
        ['c:d:a',
            {
                expressions: ['c:d:a'],
                solutions: [['c:d:a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c:d):a',
                check_status: STATUS_CORRECT
            },
        ],

        ['c/d:a',
            {
                expressions: ['c/d:a'],
                solutions: [['c/d:a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c/d):a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a:c^d',
            {
                expressions: ['a:c^d'],
                solutions: [['a:c^d']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a:(c^d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c^d:a',
            {
                expressions: ['c^d:a'],
                solutions: [['c^d:a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c^d):a',
                check_status: STATUS_CORRECT
            },
        ],



        ['c*d/a',
            {
                expressions: ['c*d/a'],
                solutions: [['c*d/a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(cd)/a',
                check_status: STATUS_CORRECT
            },
        ],
        ['c:d/a',
            {
                expressions: ['c:d/a'],
                solutions: [['c:d/a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c:d)/a',
                check_status: STATUS_CORRECT
            },
        ],

        ['c/d/a',
            {
                expressions: ['c/d/a'],
                solutions: [['c/d/a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c/d)/a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a/c^d',
            {
                expressions: ['a/c^d'],
                solutions: [['a/c^d']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a/(c^d)',
                check_status: STATUS_CORRECT
            },
        ],
        ['c^d/a',
            {
                expressions: ['c^d/a'],
                solutions: [['c^d/a']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(c^d)/a',
                check_status: STATUS_CORRECT
            },
        ],


        ['a/b',
            {
                expressions: ['a/b'],
                solutions: [['a/b']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a)/b',
                check_status: STATUS_CORRECT
            },
        ],
        ['a/b',
            {
                expressions: ['a/b'],
                solutions: [['a/b']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a/(b)',
                check_status: STATUS_CORRECT
            },
        ],
        ['a/b',
            {
                expressions: ['a/b'],
                solutions: [['a/b']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a)/(b)',
                check_status: STATUS_CORRECT
            },
        ],

        ['{a+b}/b',
            {
                expressions: ['{a+b}/b'],
                solutions: [['{a+b}/b']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a+b)/b',
                check_status: STATUS_CORRECT
            },
        ],
        ['a/{a+b}',
            {
                expressions: ['a/{a+b}'],
                solutions: [['a/{a+b}']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a/(a+b)',
                check_status: STATUS_CORRECT
            },
        ],
        ['{a+b}/{a+b}',
            {
                expressions: ['{a+b}/{a+b}'],
                solutions: [['{a+b}/{a+b}']],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a+b)/(a+b)',
                check_status: STATUS_CORRECT
            },
        ],


        ['a^b',
            {
                expressions: ['a^b'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a^(b)',
                check_status: STATUS_CORRECT
            },
        ],
        ['a^b',
            {
                expressions: ['a^b'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a)^b',
                check_status: STATUS_CORRECT
            },
        ],
        ['a^b',
            {
                expressions: ['a^b'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: '(a)^(b)',
                check_status: STATUS_CORRECT
            },
        ],
        ['a^{a+b}',
            {
                expressions: ['a^{a+b}'],
                options: ['no-penalty-for-extraneous-brackets']
            },
            {
                answer: 'a^(a+b)',
                check_status: STATUS_CORRECT
            },
        ],

    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with extraneous brackets (no-penalty-for-extraneous-brackets-in-first-negative-term)', () => {
    const specs = [[
        {
            expressions: ['2+3'],
            options: ['no-penalty-for-extraneous-brackets-in-first-negative-term']
        },
        {
            answer: '(5)',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ],
    [
        {
            expressions: ['-2+a'],
            options: ['no-penalty-for-extraneous-brackets-in-first-negative-term']
        },
        {
            answer: '(-2)+a',
            check_status: STATUS_CORRECT
        },
    ],
    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with extraneous brackets', () => {
    const specs = [
        ['2+3',
            {
                expressions: ['2+3'],
            },
            {
                answer: '(5)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['-2+a',
            {
                expressions: ['-2+a'],
            },
            {
                answer: '(-2)+a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a-(c+d)',
            {
                expressions: ['a-(c+d)'],
                solutions: [['a-(c+d)']],
            },
            {
                answer: 'a-((c+d))',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+c+d',
            {
                expressions: ['a+c+d'],
            },
            {
                answer: 'a+(c+d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+c+d',
            {
                expressions: ['a+c+d'],
            },
            {
                answer: '(a+c)+d',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+c-d',
            {
                expressions: ['a+c-d'],
            },
            {
                answer: 'a+(c-d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a-c+d',
            {
                expressions: ['a-c+d'],
            },
            {
                answer: '(a-c)+d',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+c*d',
            {
                expressions: ['a+c*d'],
            },
            {
                answer: 'a+(cd)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c*d+a',
            {
                expressions: ['c*d+a'],
            },
            {
                answer: '(cd)+a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+c:d',
            {
                expressions: ['a+c:d'],
                solutions: [['a+c:d']],
            },
            {
                answer: 'a+(c:d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c:d+a',
            {
                expressions: ['c:d+a'],
                solutions: [['c:d+a']],
            },
            {
                answer: '(c:d)+a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+c/d',
            {
                expressions: ['a+c/d'],
                solutions: [['a+c/d']],
            },
            {
                answer: 'a+(c/d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c/d+a',
            {
                expressions: ['c/d+a'],
                solutions: [['c/d+a']],
            },
            {
                answer: '(c/d)+a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+c^d',
            {
                expressions: ['a+c^d'],
            },
            {
                answer: 'a+(c^d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c^d+a',
            {
                expressions: ['c^d+a'],
            },
            {
                answer: '(c^d)+a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],



        ['a+c-d',
            {
                expressions: ['a+c-d'],
            },
            {
                answer: '(a+c)-d',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a-c-d',
            {
                expressions: ['a-c-d'],
            },
            {
                answer: '(a-c)-d',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a-c*d',
            {
                expressions: ['a-c*d'],
            },
            {
                answer: 'a-(cd)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c*d-a',
            {
                expressions: ['c*d-a'],
            },
            {
                answer: '(cd)-a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a-c:d',
            {
                expressions: ['a-c:d'],
                solutions: [['a-c:d']],
            },
            {
                answer: 'a-(c:d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c:d-a',
            {
                expressions: ['c:d-a'],
                solutions: [['c:d-a']],
            },
            {
                answer: '(c:d)-a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a-c/d',
            {
                expressions: ['a-c/d'],
                solutions: [['a-c/d']],
            },
            {
                answer: 'a-(c/d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c/d-a',
            {
                expressions: ['c/d-a'],
                solutions: [['c/d-a']],
            },
            {
                answer: '(c/d)-a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a-c^d',
            {
                expressions: ['a-c^d'],
            },
            {
                answer: 'a-(c^d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c^d-a',
            {
                expressions: ['c^d-a'],
            },
            {
                answer: '(c^d)-a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],




        ['a*c*d',
            {
                expressions: ['a*c*d'],
            },
            {
                answer: 'a(cd)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c*d*a',
            {
                expressions: ['c*d*a'],
            },
            {
                answer: '(cd)a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a*c:d',
            {
                expressions: ['a*c:d'],
                solutions: [['a*c:d']],
            },
            {
                answer: 'a(c:d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c:d*a',
            {
                expressions: ['c:d*a'],
                solutions: [['c:d*a']],
            },
            {
                answer: '(c:d)a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a*c/d',
            {
                expressions: ['a*c/d'],
                solutions: [['a*c/d']],
            },
            {
                answer: 'a(c/d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c/d*a',
            {
                expressions: ['c/d*a'],
                solutions: [['c/d*a']],
            },
            {
                answer: '(c/d)a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a*c^d',
            {
                expressions: ['a*c^d'],
            },
            {
                answer: 'a(c^d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c^d*a',
            {
                expressions: ['c^d*a'],
            },
            {
                answer: '(c^d)a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],




        ['c*d:a',
            {
                expressions: ['c*d:a'],
                solutions: [['c*d:a']],
            },
            {
                answer: '(cd):a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c:d:a',
            {
                expressions: ['c:d:a'],
                solutions: [['c:d:a']],
            },
            {
                answer: '(c:d):a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],

        ['c/d:a',
            {
                expressions: ['c/d:a'],
                solutions: [['c/d:a']],
            },
            {
                answer: '(c/d):a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a:c^d',
            {
                expressions: ['a:c^d'],
                solutions: [['a:c^d']],
            },
            {
                answer: 'a:(c^d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c^d:a',
            {
                expressions: ['c^d:a'],
                solutions: [['c^d:a']],
            },
            {
                answer: '(c^d):a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],



        ['c*d/a',
            {
                expressions: ['c*d/a'],
                solutions: [['c*d/a']],
            },
            {
                answer: '(cd)/a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c:d/a',
            {
                expressions: ['c:d/a'],
                solutions: [['c:d/a']],
            },
            {
                answer: '(c:d)/a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],

        ['c/d/a',
            {
                expressions: ['c/d/a'],
                solutions: [['c/d/a']],
            },
            {
                answer: '(c/d)/a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a/c^d',
            {
                expressions: ['a/c^d'],
                solutions: [['a/c^d']],
            },
            {
                answer: 'a/(c^d)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['c^d/a',
            {
                expressions: ['c^d/a'],
                solutions: [['c^d/a']],
            },
            {
                answer: '(c^d)/a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],


        ['a/b',
            {
                expressions: ['a/b'],
                solutions: [['a/b']],
            },
            {
                answer: '(a)/b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a/b',
            {
                expressions: ['a/b'],
                solutions: [['a/b']],
            },
            {
                answer: 'a/(b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a/b',
            {
                expressions: ['a/b'],
                solutions: [['a/b']],
            },
            {
                answer: '(a)/(b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],

        ['{a+b}/b',
            {
                expressions: ['{a+b}/b'],
                solutions: [['{a+b}/b']],
            },
            {
                answer: '(a+b)/b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a/{a+b}',
            {
                expressions: ['a/{a+b}'],
                solutions: [['a/{a+b}']],
            },
            {
                answer: 'a/(a+b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['{a+b}/{a+b}',
            {
                expressions: ['{a+b}/{a+b}'],
                solutions: [['{a+b}/{a+b}']],
            },
            {
                answer: '(a+b)/(a+b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],


        ['a^b',
            {
                expressions: ['a^b'],
            },
            {
                answer: 'a^(b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a^b',
            {
                expressions: ['a^b'],
            },
            {
                answer: '(a)^b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a^b',
            {
                expressions: ['a^b'],
            },
            {
                answer: '(a)^(b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a^{a+b}',
            {
                expressions: ['a^{a+b}'],
            },
            {
                answer: 'a^(a+b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],

    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})


describe('testing correct answer with extraneous signs (require-no-extraneaous-signs)', () => {
    const specs = [
        ['+1',
            {
                expressions: ['1'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '+1',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['-(-1)',
            {
                expressions: ['1'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '-(-1)',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['-(+1)',
            {
                expressions: ['-1'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '-(+1)',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['+(+1)',
            {
                expressions: ['1'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '+(+1)',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['+(-1)',
            {
                expressions: ['-1'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '+(-1)',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['(-a)*(-b)',
            {
                expressions: ['a*b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '(-a)*(-b)',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['(-a)*b',
            {
                expressions: ['-a*b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '(-a)*b',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a*(-b)',
            {
                expressions: ['-a*b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: 'a*(-b)',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['(-a):(-b)',
            {
                expressions: ['a:b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '(-a):(-b)',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['(-a):b',
            {
                expressions: ['-a:b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '(-a):b',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a:(-b)',
            {
                expressions: ['-a:b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: 'a:(-b)',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['{-a}/{-b}',
            {
                expressions: ['a/b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '{-a}/{-b}',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['{-a}/b',
            {
                expressions: ['-a/b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: '{-a}/b',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a/{-b}',
            {
                expressions: ['-a/b'],
                options: ['require-no-extraneaous-signs']
            },
            {
                answer: 'a/{-b}',
                check_status: STATUS_BAD_FORM
            },
        ],

    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with extraneous signs (no-penalty-for-extraneous-signs)', () => {
    const specs = [
        ['+1',
            {
                expressions: ['1'],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '+1',
                check_status: STATUS_CORRECT
            },
        ],
        ['-(-1)',
            {
                expressions: ['1'],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '-(-1)',
                check_status: STATUS_CORRECT
            },
        ],
        ['-(+1)',
            {
                expressions: ['-1'],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '-(+1)',
                check_status: STATUS_CORRECT
            },
        ],
        ['+(+1)',
            {
                expressions: ['1'],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '+(+1)',
                check_status: STATUS_CORRECT
            },
        ],
        ['+(-1)',
            {
                expressions: ['-1'],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '+(-1)',
                check_status: STATUS_CORRECT
            },
        ],
        ['(-a)*(-b)',
            {
                expressions: ['a*b'],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '(-a)(-b)',
                check_status: STATUS_CORRECT
            },
        ],
        ['(-a)*b',
            {
                expressions: ['-a*b'],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '(-a)b',
                check_status: STATUS_CORRECT
            },
        ],
        ['a*(-b)',
            {
                expressions: ['-a*b'],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: 'a(-b)',
                check_status: STATUS_CORRECT
            },
        ],
        ['(-a):(-b)',
            {
                expressions: ['a:b'],
                solutions: [['a:b']],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '(-a):(-b)',
                check_status: STATUS_CORRECT
            },
        ],
        ['(-a):b',
            {
                expressions: ['-a:b'],
                solutions: [['-a:b']],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '(-a):b',
                check_status: STATUS_CORRECT
            },
        ],
        ['a:(-b)',
            {
                expressions: ['-a:b'],
                solutions: [['-a:b']],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: 'a:(-b)',
                check_status: STATUS_CORRECT
            },
        ],
        ['{-a}/{-b}',
            {
                expressions: ['a/b'],
                solutions: [['a/b']],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '{-a}/{-b}',
                check_status: STATUS_CORRECT
            },
        ],
        ['{-a}/b',
            {
                expressions: ['-a/b'],
                solutions: [['-a/b']],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: '{-a}/b',
                check_status: STATUS_CORRECT
            },
        ],
        ['a/{-b}',
            {
                expressions: ['-a/b'],
                solutions: [['-a/b']],
                options: ['no-penalty-for-extraneous-signs']
            },
            {
                answer: 'a/{-b}',
                check_status: STATUS_CORRECT
            },
        ],

    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with extraneous signs', () => {
    const specs = [
        ['+1',
            {
                expressions: ['1'],
            },
            {
                answer: '+1',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['-(-1)',
            {
                expressions: ['1'],
            },
            {
                answer: '-(-1)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['-(+1)',
            {
                expressions: ['-1'],
            },
            {
                answer: '-(+1)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['+(+1)',
            {
                expressions: ['1'],
            },
            {
                answer: '+(+1)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['+(-1)',
            {
                expressions: ['-1'],
            },
            {
                answer: '+(-1)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['(-a)*(-b)',
            {
                expressions: ['a*b'],
            },
            {
                answer: '(-a)(-b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['(-a)*b',
            {
                expressions: ['-a*b'],
            },
            {
                answer: '(-a)b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a*(-b)',
            {
                expressions: ['-a*b'],
            },
            {
                answer: 'a(-b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['(-a):(-b)',
            {
                expressions: ['a:b'],
                solutions: [['a:b']],
            },
            {
                answer: '(-a):(-b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['(-a):b',
            {
                expressions: ['-a:b'],
                solutions: [['-a:b']],
            },
            {
                answer: '(-a):b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a:(-b)',
            {
                expressions: ['-a:b'],
                solutions: [['-a:b']],
            },
            {
                answer: 'a:(-b)',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['{-a}/{-b}',
            {
                expressions: ['a/b'],
                solutions: [['a/b']],
            },
            {
                answer: '{-a}/{-b}',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['{-a}/b',
            {
                expressions: ['-a/b'],
                solutions: [['-a/b']],
            },
            {
                answer: '{-a}/b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a/{-b}',
            {
                expressions: ['-a/b'],
                solutions: [['-a/b']],
            },
            {
                answer: 'a/{-b}',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],

    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})




describe('testing correct answer with correct spaces (require-correct-spaces)', () => {
    const specs = [[
        {
            expressions: ['1234'],
            options: ['require-correct-spaces']
        },
        {
            answer: '1 234',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['1234567890'],
            options: ['require-correct-spaces']
        },
        {
            answer: '1 234 567 890',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['1,2345'],
            options: ['require-correct-spaces'],
            'result-type': 'decimal'
        },
        {
            answer: '1,234 5',
            check_status: STATUS_CORRECT
        },
    ],
    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with incorrect spaces (require-correct-spaces)', () => {
    const specs = [[
        {
            expressions: ['1234'],
            options: ['require-correct-spaces']
        },
        {
            answer: '1234',
            check_status: STATUS_BAD_FORM
        },
    ],
    [
        {
            expressions: ['1234'],
            options: ['require-correct-spaces']
        },
        {
            answer: '1 2 3 4',
            check_status: STATUS_BAD_FORM
        },
    ],
    [
        {
            expressions: ['1,2345'],
            options: ['require-correct-spaces']
        },
        {
            answer: '1,2345',
            check_status: STATUS_BAD_FORM
        },
    ],
    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with incorrect spaces (no-penalty-for-incorrect-spaces)', () => {
    const specs = [[
        {
            expressions: ['1234'],
            options: ['no-penalty-for-incorrect-spaces']
        },
        {
            answer: '1234',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['1234'],
            options: ['no-penalty-for-incorrect-spaces']
        },
        {
            answer: '1 2 3 4',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['1,2345'],
            options: ['no-penalty-for-incorrect-spaces'],
            'result-type': 'decimal'
        },
        {
            answer: '1,2345',
            check_status: STATUS_CORRECT
        },
    ],
    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with incorrect spaces', () => {
    const specs = [[
        {
            expressions: ['1234'],
        },
        {
            answer: '1234',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ],
    [
        {
            expressions: ['1234'],
        },
        {
            answer: '1 2 3 4',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ],
    [
        {
            expressions: ['1,2345'],
            'result-type': 'decimal'
        },
        {
            answer: '1,2345',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ],
    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})






describe('testing correct answer with implicit product (require-implicit-products)', () => {
    const specs = [[
        {
            expressions: ['2*a'],
            options: ['require-implicit-products']
        },
        {
            answer: '2a',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['(3+a)*b'],
            options: ['require-implicit-products'],
            solutions: [['(3+a)*b']]
        },
        {
            answer: '(3+a)b',
            check_status: STATUS_CORRECT
        },
    ],


    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with explicit product (require-implicit-products)', () => {
    const specs = [[
        {
            expressions: ['2*a'],
            options: ['require-implicit-products']
        },
        {
            answer: '2*a',
            check_status: STATUS_BAD_FORM
        },
    ],
    [
        {
            expressions: ['(3+a)*b'],
            options: ['require-implicit-products'],
            solutions: [['(3+a)*b']]
        },
        {
            answer: '(3+a)*b',
            check_status: STATUS_BAD_FORM
        },
    ],


    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with implicit product (no-penalty-for-explicit-products)', () => {
    const specs = [[
        {
            expressions: ['2*a'],
            options: ['no-penalty-for-explicit-products']
        },
        {
            answer: '2a',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['(3+a)*b'],
            options: ['no-penalty-for-explicit-products'],
            solutions: [['(3+a)*b']]
        },
        {
            answer: '(3+a)b',
            check_status: STATUS_CORRECT
        },
    ],


    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with explicit product (no-penalty-for-explicit-products)', () => {
    const specs = [[
        {
            expressions: ['2*a'],
            options: ['no-penalty-for-explicit-products']
        },
        {
            answer: '2*a',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['(3+a)*b'],
            options: ['no-penalty-for-explicit-products'],
            solutions: [['(3+a)*b']]
        },
        {
            answer: '(3+a)*b',
            check_status: STATUS_CORRECT
        },
    ],


    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with implicit product', () => {
    const specs = [[
        {
            expressions: ['2*a'],
        },
        {
            answer: '2a',
            check_status: STATUS_CORRECT
        },
    ],
    [
        {
            expressions: ['(3+a)*b'],
            solutions: [['(3+a)*b']]
        },
        {
            answer: '(3+a)b',
            check_status: STATUS_CORRECT
        },
    ],


    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with explicit product', () => {
    const specs = [[
        {
            expressions: ['2*a'],
        },
        {
            answer: '2*a',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ],
    [
        {
            expressions: ['(3+a)*b'],
            solutions: [['(3+a)*b']]
        },
        {
            answer: '(3+a)*b',
            check_status: STATUS_UNOPTIMAL_FORM
        },
    ],


    ]
    test.each(specs)('', (q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})



describe('testing correct answer with factor one (require-no-factor-one)', () => {
    const specs = [
        ['1*1',
            {
                expressions: ['1'],
                options: ['require-no-factor-one']
            },
            {
                answer: '1*1',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['1*a',
            {
                expressions: ['a'],
                options: ['require-no-factor-one']
            },
            {
                answer: '1*a',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a*1',
            {
                expressions: ['a'],
                options: ['require-no-factor-one']
            },
            {
                answer: 'a*1',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a*1*b',
            {
                expressions: ['a*b'],
                options: ['require-no-factor-one']
            },
            {
                answer: 'a*1*b',
                check_status: STATUS_BAD_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with factor one (no-penalty-for-factor-one)', () => {
    const specs = [
        ['1*1',
            {
                expressions: ['1'],
                options: ['no-penalty-for-factor-one']
            },
            {
                answer: '1*1',
                check_status: STATUS_CORRECT
            },
        ],
        ['1*a',
            {
                expressions: ['a'],
                options: ['no-penalty-for-factor-one']
            },
            {
                answer: '1a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a*1',
            {
                expressions: ['a'],
                options: ['no-penalty-for-factor-one']
            },
            {
                answer: 'a*1',
                check_status: STATUS_CORRECT
            },
        ],
        ['a*1*b',
            {
                expressions: ['a*b'],
                options: ['no-penalty-for-factor-one']
            },
            {
                answer: 'a*1b',
                check_status: STATUS_CORRECT
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with factor one', () => {
    const specs = [
        ['1*1',
            {
                expressions: ['1'],
            },
            {
                answer: '1*1',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['1*a',
            {
                expressions: ['a'],
            },
            {
                answer: '1a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a*1',
            {
                expressions: ['a'],
            },
            {
                answer: 'a*1',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a*1*b',
            {
                expressions: ['a*b'],
            },
            {
                answer: 'a*1b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})



describe('testing correct answer with factor zero (require-no-factor-zero)', () => {
    const specs = [
        ['0*0',
            {
                expressions: ['0'],
                options: ['require-no-factor-zero']
            },
            {
                answer: '0*0',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['0*a',
            {
                expressions: ['0'],
                options: ['require-no-factor-zero']
            },
            {
                answer: '0*a',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a*0',
            {
                expressions: ['0'],
                options: ['require-no-factor-zero']
            },
            {
                answer: 'a*0',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a*0*b',
            {
                expressions: ['0'],
                options: ['require-no-factor-zero']
            },
            {
                answer: 'a*0*b',
                check_status: STATUS_BAD_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with factor zero (no-penalty-for-factor-zero)', () => {
    const specs = [
        ['0*0',
            {
                expressions: ['0'],
                options: ['no-penalty-for-factor-zero']
            },
            {
                answer: '0*0',
                check_status: STATUS_CORRECT
            },
        ],
        ['0*a',
            {
                expressions: ['0'],
                options: ['no-penalty-for-factor-zero']
            },
            {
                answer: '0a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a*0',
            {
                expressions: ['0'],
                options: ['no-penalty-for-factor-zero']
            },
            {
                answer: 'a*0',
                check_status: STATUS_CORRECT
            },
        ],
        ['a*0*b',
            {
                expressions: ['0'],
                options: ['no-penalty-for-factor-zero']
            },
            {
                answer: 'a*0b',
                check_status: STATUS_CORRECT
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with factor zero', () => {
    const specs = [
        ['0*0',
            {
                expressions: ['0'],
            },
            {
                answer: '0*0',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['0*a',
            {
                expressions: ['0'],
            },
            {
                answer: '0a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a*0',
            {
                expressions: ['0'],
            },
            {
                answer: 'a*0',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a*0*b',
            {
                expressions: ['0'],
            },
            {
                answer: 'a*0b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})



describe('testing correct answer with null term (require-no-null-terms)', () => {
    const specs = [
        ['0+0',
            {
                expressions: ['0'],
                options: ['require-no-null-terms']
            },
            {
                answer: '0+0',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['0+a',
            {
                expressions: ['a'],
                options: ['require-no-null-terms']
            },
            {
                answer: '0+a',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a+0',
            {
                expressions: ['a'],
                options: ['require-no-null-terms']
            },
            {
                answer: 'a+0',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a+0+b',
            {
                expressions: ['a+b'],
                options: ['require-no-null-terms']
            },
            {
                answer: 'a+0+b',
                check_status: STATUS_BAD_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with null term (no-penalty-for-null-terms)', () => {
    const specs = [
        ['0+0',
            {
                expressions: ['0'],
                options: ['no-penalty-for-null-terms']
            },
            {
                answer: '0+0',
                check_status: STATUS_CORRECT
            },
        ],
        ['0+a',
            {
                expressions: ['a'],
                options: ['no-penalty-for-null-terms']
            },
            {
                answer: '0+a',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+0',
            {
                expressions: ['a'],
                options: ['no-penalty-for-null-terms']
            },
            {
                answer: 'a+0',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+0+b',
            {
                expressions: ['a+b'],
                options: ['no-penalty-for-null-terms']
            },
            {
                answer: 'a+0+b',
                check_status: STATUS_CORRECT
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with null term', () => {
    const specs = [
        ['0+0',
            {
                expressions: ['0'],
            },
            {
                answer: '0*0',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['0+a',
            {
                expressions: ['a'],
            },
            {
                answer: '0+a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+0',
            {
                expressions: ['a'],
            },
            {
                answer: 'a+0',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+0+b',
            {
                expressions: ['a+b'],
            },
            {
                answer: 'a+0+b',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})




describe('testing correct answer with non reduced fraction (require-reduced-fractions)', () => {
    const specs = [
        ['4/2',
            {
                expressions: ['2'],
                options: ['require-reduced-fractions']
            },
            {
                answer: '4/2',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['2/4',
            {
                expressions: ['1/2'],
                options: ['require-reduced-fractions']
            },
            {
                answer: '2/4',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['a+2/4',
            {
                expressions: ['a+1/2'],
                options: ['require-reduced-fractions']
            },
            {
                answer: 'a+2/4',
                check_status: STATUS_BAD_FORM
            },
        ],

    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with non reduced fraction (no-penalty-for-non-reduced-fractions)', () => {
    const specs = [
        ['4/2',
            {
                expressions: ['2'],
                options: ['no-penalty-for-non-reduced-fractions']
            },
            {
                answer: '4/2',
                check_status: STATUS_CORRECT
            },
        ],
        ['2/4',
            {
                expressions: ['1/2'],
                options: ['no-penalty-for-non-reduced-fractions']
            },
            {
                answer: '2/4',
                check_status: STATUS_CORRECT
            },
        ],
        ['a+2/4',
            {
                expressions: ['a+1/2'],
                solutions: [['a+1/2']],
                options: ['no-penalty-for-non-reduced-fractions']
            },
            {
                answer: 'a+2/4',
                check_status: STATUS_CORRECT
            },
        ],

    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with non reduced fraction', () => {
    const specs = [
        ['4/2',
            {
                expressions: ['2'],
            },
            {
                answer: '4/2',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['2/4',
            {
                expressions: ['1/2'],
            },
            {
                answer: '2/4',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['a+2/4',
            {
                expressions: ['a+1/2'],
                solutions: [['a+1/2']],
            },
            {
                answer: 'a+2/4',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],

    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})


describe('testing correct answer with permuted terms (disallow-terms-permutation)', () => {
    const specs = [
        ['b+a',
            {
                expressions: ['a+b'],
                options: ['disallow-terms-permutation']
            },
            {
                answer: 'b+a',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['b+a+c',
            {
                expressions: ['a+b+c'],
                options: ['disallow-terms-permutation']
            },
            {
                answer: 'b+a+c',
                check_status: STATUS_BAD_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with permuted terms (penalty-for-terms-permutation)', () => {
    const specs = [
        ['b+a',
            {
                expressions: ['a+b'],
                options: ['penalty-for-terms-permutation']
            },
            {
                answer: 'b+a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['b+a+c',
            {
                expressions: ['a+b+c'],
                options: ['penalty-for-terms-permutation']
            },
            {
                answer: 'b+a+c',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with permuted terms', () => {
    const specs = [
        ['b+a',
            {
                expressions: ['a+b'],
            },
            {
                answer: 'b+a',
                check_status: STATUS_CORRECT
            },
        ],
        ['b+a+c',
            {
                expressions: ['a+b+c'],
            },
            {
                answer: 'b+a+c',
                check_status: STATUS_CORRECT
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})



describe('testing correct answer with permuted factors (disallow-factors-permutation)', () => {
    const specs = [
        ['b*a',
            {
                expressions: ['a*b'],
                options: ['disallow-factors-permutation']
            },
            {
                answer: 'b*a',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['b*a*c',
            {
                expressions: ['a*b*c'],
                options: ['disallow-factors-permutation']
            },
            {
                answer: 'b*a*c',
                check_status: STATUS_BAD_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with permuted factors (penalty-for-factors-permutation)', () => {
    const specs = [
        ['b*a',
            {
                expressions: ['a*b'],
                options: ['penalty-for-factors-permutation']
            },
            {
                answer: 'ba',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['b*a*c',
            {
                expressions: ['a*b*c'],
                options: ['penalty-for-factors-permutation']
            },
            {
                answer: 'bac',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})

describe('testing correct answer with permuted factors', () => {
    const specs = [
        ['b*a',
            {
                expressions: ['a*b'],
            },
            {
                answer: 'ba',
                check_status: STATUS_CORRECT
            },
        ],
        ['b+a+c',
            {
                expressions: ['a*b*c'],
            },
            {
                answer: 'bac',
                check_status: STATUS_CORRECT
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})



describe('testing correct answer with permuted terms or factors (disallow-terms-and-factors-permutation)', () => {
    const specs = [
        ['b*a',
            {
                expressions: ['a*b'],
                options: ['disallow-terms-and-factors-permutation']
            },
            {
                answer: 'b*a',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['b*a*c',
            {
                expressions: ['a*b*c'],
                options: ['disallow-terms-and-factors-permutation']
            },
            {
                answer: 'b*a*c',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['b+a',
            {
                expressions: ['a+b'],
                options: ['disallow-terms-and-factors-permutation']
            },
            {
                answer: 'b+a',
                check_status: STATUS_BAD_FORM
            },
        ],
        ['b+a+c',
            {
                expressions: ['a+b+c'],
                options: ['disallow-terms-and-factors-permutation']
            },
            {
                answer: 'b+a+c',
                check_status: STATUS_BAD_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})
describe('testing correct answer with permuted terms or factors (penalty-for-terms-and-factors-permutation)', () => {
    const specs = [
        ['b*a',
            {
                expressions: ['a*b'],
                options: ['penalty-for-terms-and-factors-permutation']
            },
            {
                answer: 'ba',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['b*a*c',
            {
                expressions: ['a*b*c'],
                options: ['penalty-for-terms-and-factors-permutation']
            },
            {
                answer: 'bac',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['b+a',
            {
                expressions: ['a+b'],
                options: ['penalty-for-terms-and-factors-permutation']
            },
            {
                answer: 'b+a',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
        ['b+a+c',
            {
                expressions: ['a+b+c'],
                options: ['penalty-for-terms-and-factors-permutation']
            },
            {
                answer: 'b+a+c',
                check_status: STATUS_UNOPTIMAL_FORM
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})
describe('testing correct answer with permuted terms or terms', () => {
    const specs = [
        ['b+a',
            {
                expressions: ['a+b'],
            },
            {
                answer: 'b+a',
                check_status: STATUS_CORRECT
            },
        ],
        ['b+a+c',
            {
                expressions: ['a+b+c'],
            },
            {
                answer: 'b+a+c',
                check_status: STATUS_CORRECT
            },
        ],
        ['b+a',
            {
                expressions: ['a+b'],
            },
            {
                answer: 'b+a',
                check_status: STATUS_CORRECT
            },
        ],
        ['b+a+c',
            {
                expressions: ['a+b+c'],
            },
            {
                answer: 'b+a+c',
                check_status: STATUS_CORRECT
            },
        ],
    ]
    test.each(specs)('%s', (s, q, check) => {
        const generated = generateQuestion(q)
        const item = {
            ...generated,
            ...check
        }
        assessItem(item)
        expect(item.status).toBe(item.check_status)
    })
})