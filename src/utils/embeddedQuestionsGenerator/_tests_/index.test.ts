import Prando from 'prando';
import embeddedQuestionsGenerator from '..';

const seed = 'Test_Seed';

const standardQuestions = [
  { stem: '1 + 2', correctAnswer: [3], distractors: [1, 2, 4, 5] },
  { stem: '3 + 2', correctAnswer: [5], distractors: [1, 2, 3, 4] },
  { stem: '1 + 1', correctAnswer: [2], distractors: [1, 3, 4, 5] },
  { stem: '1 + 0', correctAnswer: [1], distractors: [2, 3, 4, 5] },
  { stem: '2 + 2', correctAnswer: [4], distractors: [1, 2, 3, 5] },
];

const twoAnswerChoiceQuestions = [
  { stem: '1 + 2', correctAnswer: [3], distractors: [1] },
  { stem: '3 + 2', correctAnswer: [5], distractors: [1] },
  { stem: '1 + 1', correctAnswer: [2], distractors: [1] },
  { stem: '1 + 0', correctAnswer: [1], distractors: [2] },
  { stem: '2 + 2', correctAnswer: [4], distractors: [1] },
];

const groupedQuestions = [
  {
    common: { paragraph: 'Story one text here.' },
    group: [
      {
        stem: 'Where does this story begin?',
        correctAnswer: ['Some place'],
        distractors: ['Some other place'],
      },
      {
        stem: 'When does this story take place?',
        correctAnswer: ['Some time'],
        distractors: ['Some other time'],
      },
    ],
  },
  {
    common: { paragraph: 'Story two text here.' },
    group: [
      {
        stem: 'Where does this story begin?',
        correctAnswer: ['Some place'],
        distractors: ['Some other place'],
      },
      {
        stem: 'When does this story take place?',
        correctAnswer: ['Some time'],
        distractors: ['Some other time'],
      },
    ],
  },
];

describe('embeddedQuestionsGenerator', () => {
  it('should return a shuffled version of the available questions being passed in, with shuffled answer choices (including all correct answers and distractors) added to each question', () => {
    const generator = embeddedQuestionsGenerator({
      numberGenerator: new Prando(seed),
      availableQuestions: standardQuestions,
    });
    expect(generator.getQuestions()).toMatchSnapshot();
  });

  it('should return only the number of questions specified by requiredQuestionCount', () => {
    const generator = embeddedQuestionsGenerator({
      numberGenerator: new Prando(seed),
      availableQuestions: standardQuestions,
      requiredQuestionCount: 1,
    });
    expect(generator.getQuestions()).toMatchSnapshot();
  });

  it('should keep questions in order if shuffledQuestions is set to false', () => {
    const generator = embeddedQuestionsGenerator({
      numberGenerator: new Prando(seed),
      availableQuestions: standardQuestions,
      shuffledQuestions: false,
    });
    expect(generator.getQuestions()).toMatchSnapshot();
  });

  it('should not add answer choices to the questions if shuffledChoices is set to false', () => {
    const generator = embeddedQuestionsGenerator({
      numberGenerator: new Prando(seed),
      availableQuestions: standardQuestions,
      shuffledChoices: false,
    });
    expect(generator.getQuestions()).toMatchSnapshot();
  });

  it('should allow shuffled answer choices to organically end up in the same order that they were passed in, when forceShuffledChoices is left at its default state of false', () => {
    const generator = embeddedQuestionsGenerator({
      numberGenerator: new Prando(seed),
      availableQuestions: twoAnswerChoiceQuestions,
    });
    expect(generator.getQuestions()).toMatchSnapshot();
  });

  it('should ensure that answer choices are shuffled in a way that they are never in the same order in which they were passed in, when forceShuffledChoices is set to true', () => {
    const generator = embeddedQuestionsGenerator({
      numberGenerator: new Prando(seed),
      availableQuestions: twoAnswerChoiceQuestions,
      forceShuffledChoices: true,
    });
    expect(generator.getQuestions()).toMatchSnapshot();
  });

  it('should support questions passed in as a grouped format, while keeping grouped questions together during the shuffling process, when groupedQuestions is set to true', () => {
    const generator = embeddedQuestionsGenerator({
      numberGenerator: new Prando(seed),
      availableQuestions: groupedQuestions,
      groupedQuestions: true,
    });
    expect(generator.getQuestions()).toMatchSnapshot();
  });
});
