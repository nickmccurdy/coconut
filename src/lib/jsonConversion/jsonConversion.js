const Promise = require('bluebird');
const bb = Promise.promisifyAll(require('fs'));
const mjAPI = require('mathjax-node-svg2png');
const shortHash = require('short-hash');
const base64ToImage = require('base64-to-image');

const setMjAPI = () => {
  mjAPI.config({
    MathJax: {
      displayAlign: 'left',
      SVG: {
        font: 'STIX-Web',
      },
    },
  });
  mjAPI.start();
};

const createDir = (subDir, contentHash, activityId, imageCount, endDir, fileName) => {
  const updatedSubDir = endDir ? `${subDir}/${endDir}` : subDir;
  const dir = `./tools/texturePacker/mathSuccess/sprites/${activityId}/${updatedSubDir}`;
  const updatedFileName = `${fileName || subDir}-${imageCount}-${contentHash}.png`;
  const filePath = `${dir}/${updatedFileName}`;
  if (bb.existsSync(filePath)) return { dir, fileName: updatedFileName, shouldSkip: true };
  if (!bb.existsSync(dir)) {
    bb.mkdirSync(dir, { recursive: true });
  }

  return { dir, fileName: updatedFileName, shouldSkip: false };
};

const generateMathImage = (math, dir, fileName) => {
  mjAPI
    .typeset({
      math,
      format: 'TeX', // or "inline-TeX", "MathML"
      svg: false, // or svg:true, or html:true
      width: 65,
      linebreaks: true,
      ex: 20,
      png: true, // enable PNG generation
      scale: 0.5,
    })
    .then(
      data => {
        if (!data.errors) base64ToImage(data.png, `${dir}/`, { fileName });
      },
      error => {
        console.log(error);
        console.log(math);
      },
    );
};

const cleanAnswerChoiceDir = (json, child, answerIndex, questionIndex, fileName, dir) => {
  let { questionImages } = json.embeddedQuestions[questionIndex];
  if (!questionImages) {
    json.embeddedQuestions[questionIndex].questionImages = {};
    questionImages = json.embeddedQuestions[questionIndex];
  }

  const childNode = questionImages[child];
  if (!childNode) {
    json.embeddedQuestions[questionIndex].questionImages[child] = [];
  }

  const oldImage = questionImages[child][answerIndex];
  json.embeddedQuestions[questionIndex].questionImages[child][answerIndex] = fileName;

  if (bb.existsSync(`${dir}/${oldImage}`)) bb.unlinkSync(`${dir}/${oldImage}`);
};

const processAnswerChoice = (
  json,
  answerChoiceJson,
  name,
  activityId,
  questionIndex,
  answerChoiceIndex,
) => {
  const correctAnswerString = JSON.stringify(answerChoiceJson);
  const correctAnswerHash = shortHash(correctAnswerString);
  const { dir, fileName, shouldSkip } = createDir(
    'questions',
    correctAnswerHash,
    activityId,
    answerChoiceIndex + 1,
    `${questionIndex}/${name}`,
    name,
  );

  if (!shouldSkip) {
    generateMathImage(answerChoiceJson, dir, fileName);
    cleanAnswerChoiceDir(json, name, answerChoiceIndex, questionIndex - 1, fileName, dir);
  }
};

const generateAnswerChoices = (json, jsonNode, activityId, questionIndex) => {
  const answerJson = jsonNode.correctAnswer[0];
  processAnswerChoice(json, answerJson, 'correct', activityId, questionIndex, 0);
  jsonNode.distractors.forEach((distractor, index) => {
    processAnswerChoice(json, distractor, 'distractors', activityId, questionIndex, index);
  });
};

const cleanDir = (json, index, fileName, dir, nodeName) => {
  const oldImage = json[nodeName][index].pageImage;
  json[nodeName][index].pageImage = fileName;
  if (bb.existsSync(`${dir}/${oldImage}`)) bb.unlinkSync(`${dir}/${oldImage}`);
};

const processJsonNode = (json, jsonNode, nodeName, activityId) => {
  jsonNode.forEach((content, index) => {
    const contentString = JSON.stringify(content.stem);
    const contentHash = shortHash(contentString);
    const nodeType = nodeName === 'embeddedLessons' ? 'lessons' : 'questions';
    const { dir, fileName, shouldSkip } = createDir(
      nodeType,
      contentHash,
      activityId,
      index + 1,
      nodeName === 'embeddedQuestions' ? index + 1 : undefined,
    );

    if (!shouldSkip) {
      generateMathImage(content.stem, dir, fileName);
      cleanDir(json, index, fileName, dir, nodeName);
    }
    if (nodeName === 'embeddedQuestions') {
      generateAnswerChoices(json, content, activityId, index + 1);
    }
  });
};

const resolveJsonPromise = (filePromises, fileNames, dirName) => {
  filePromises.forEach((jsonBuffer, index) => {
    const jsonString = jsonBuffer.toString('utf8');
    const json = JSON.parse(jsonString);
    if (json.globals.generateImages) {
      if (json.embeddedLessons) {
        processJsonNode(json, json.embeddedLessons, 'embeddedLessons', json.globals.activityId);
      }
      if (json.embeddedQuestions) {
        processJsonNode(json, json.embeddedQuestions, 'embeddedQuestions', json.globals.activityId);
      }
      bb.writeFileSync(`${dirName}${fileNames[index]}`, JSON.stringify(json, null, 2));
    }
  });
};

const readJsonFiles = dirName => {
  const promises = [];
  const fileNames = [];
  new Promise((fulfil, reject) => {
    bb.readdir(dirName, (error, files) => {
      fileNames.push(...files);
      if (error) reject(error);
      fileNames.forEach(filename => promises.push(bb.readFileAsync(dirName + filename)));
      fulfil(Promise.all(promises));
    });
  }).then(
    filePromises => {
      resolveJsonPromise(filePromises, fileNames, dirName);
    },
    error => {
      console.log(error);
    },
  );
};

setMjAPI();
readJsonFiles(process.argv.slice(-1)[0]);
