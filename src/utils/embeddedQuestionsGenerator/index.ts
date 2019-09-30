import { prandoShuffle } from '../questionGeneration';

const getShuffledAnswerChoices = (
  numberGenerator,
  forceShuffledChoices,
  { distractors, correctAnswer },
) => {
  const answerOptions = distractors ? [...correctAnswer, ...distractors] : correctAnswer;
  return prandoShuffle(numberGenerator, answerOptions, forceShuffledChoices);
};

const getOrderedQuestions = ({
  numberGenerator,
  availableQuestions,
  requiredQuestionCount,
  shuffledQuestions,
}) => {
  const questions = shuffledQuestions
    ? prandoShuffle(numberGenerator, availableQuestions, false)
    : availableQuestions;

  return questions.slice(0, requiredQuestionCount);
};

const formattedStandardQuestions = (orderedQuestions, numberGenerator, forceShuffledChoices) => (
  orderedQuestions.map(question => {
    const answerChoices = getShuffledAnswerChoices(numberGenerator, forceShuffledChoices, question);
    return { ...question, answerChoices };
  })
);

const formattedGroupedQuestions = (orderedQuestions, numberGenerator, forceShuffledChoices) => (
  orderedQuestions.reduce((accumulator, section) => {
    const { common, group } = section;

    const sectionQuestions = group.map(question => {
      const answerChoices = getShuffledAnswerChoices(
        numberGenerator,
        forceShuffledChoices,
        question,
      );

      return { ...question, ...common, answerChoices };
    });

    return [...accumulator, ...sectionQuestions];
  }, [])
);

const getFormattedQuestions = ({
  numberGenerator,
  shuffledChoices,
  forceShuffledChoices,
  orderedQuestions,
  groupedQuestions,
}) => {
  let formattedQuestions = orderedQuestions;

  if (shuffledChoices) {
    const formatter = groupedQuestions ? formattedGroupedQuestions : formattedStandardQuestions;
    formattedQuestions = formatter(orderedQuestions, numberGenerator, forceShuffledChoices);
  }

  return formattedQuestions;
};

/**
 * Creates an embedded question generator (for static questions that are added to a JSON file).
 *
 * @param options Options object.
 * @param options.numberGenerator Pseudo random number generator created with Prando.
 * @param options.availableQuestions All possible questions that the activity can have.
 * @param options.requiredQuestionCount How many questions it takes to complete the activity.
 * @param options.shuffledQuestions Whether or not the questions should be shuffled.
 * @param options.shuffledChoices Whether or not the answer choices should be shuffled. If this
 * option is set to false, you should manually add answer choices (with the desired order) on to
 * each question in the JSON.
 * @param options.forceShuffledChoices Whether or not the answer choices should always be shuffled
 * until they do not match the order in which they were passed in. This can be useful in situations
 * where the correct answer is an order, assuming you don't want the user to have the answer
 * presented to them in the right order at any time. This option should be used strategically,
 * rather than habitually, since it can cause the correct answer to be predictable (e.g. answer
 * always on right side when shuffling 2-choice questions that are already ordered). See unit tests
 * for examples.
 * @param options.groupedQuestions Whether or not the questions are formatted into groups. See unit
 * tests for examples.
 *
 * @example
 *
 * embeddedQuestionsGenerator({
 *   numberGenerator: new Prando('someSeed'),
 *   availableQuestions: [{ "stem": "1 + 2", "correctAnswer": [3], "distractors": [4] }],
 * });
 */
const embeddedQuestionsGenerator = ({
  numberGenerator,
  availableQuestions,
  requiredQuestionCount = availableQuestions.length,
  shuffledQuestions = true,
  shuffledChoices = true,
  forceShuffledChoices = false,
  groupedQuestions = false,
}) => (
  {
    getQuestions: () => {
      // Shuffle if necessary, and return only the number of questions needed.
      const orderedQuestions = getOrderedQuestions({
        numberGenerator,
        availableQuestions,
        requiredQuestionCount,
        shuffledQuestions,
      });

      // Add answer choices on to each question.
      const formattedQuestions = getFormattedQuestions({
        numberGenerator,
        shuffledChoices,
        forceShuffledChoices,
        orderedQuestions,
        groupedQuestions,
      });

      return formattedQuestions;
    },
  }
);

export default embeddedQuestionsGenerator;
