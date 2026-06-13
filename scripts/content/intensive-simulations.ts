import type {
  EditorialImportOptionLabel,
  EditorialImportQuestion,
} from "../../src/lib/editorial/import/types";
import {
  INTENSIVE_SIMULATION_SOURCE_REFERENCE,
  intensiveSimulationTemplates,
} from "../../src/lib/simulations/intensive-pgm";

export { intensiveSimulationTemplates };

type IntensiveQuestionInput = {
  id: string;
  title: string;
  statement: string;
  language: "english" | "spanish";
  subcategory:
    | "reading-comprehension"
    | "grammar"
    | "vocabulary"
    | "communication"
    | "comprension-lectora"
    | "gramatica"
    | "vocabulario"
    | "comunicacion";
  competence:
    | "eng-identify-main-idea"
    | "eng-infer-implicit-information"
    | "eng-contextual-vocabulary"
    | "eng-apply-grammar-rule"
    | "eng-everyday-communication"
    | "spa-interpret-texts"
    | "spa-apply-grammar"
    | "spa-recognize-false-cognates"
    | "spa-everyday-communication";
  difficulty: 1 | 2 | 3 | 4;
  correctLabel: EditorialImportOptionLabel;
  correctText: string;
  distractors: [string, string, string, string];
  rationale: string;
  topic: string;
};

const optionLabels: EditorialImportOptionLabel[] = ["A", "B", "C", "D", "E"];

function intensiveQuestion(input: IntensiveQuestionInput): EditorialImportQuestion {
  let distractorIndex = 0;
  const options = optionLabels.map((label) => ({
    label,
    text:
      label === input.correctLabel
        ? input.correctText
        : input.distractors[distractorIndex++],
    isCorrect: label === input.correctLabel,
  }));

  return {
    id: input.id,
    title: input.title,
    statement: input.statement,
    language: input.language,
    category: input.language === "english" ? "english" : "spanish",
    subcategory: input.subcategory,
    competence: input.competence,
    difficulty_level: input.difficulty,
    options,
    correct_answer: input.correctLabel,
    explanation: `${input.rationale} A alternativa correta e "${input.correctText}". Os distratores apresentam formas gramaticais inadequadas, informacoes nao sustentadas pelo contexto ou escolhas lexicais que nao cumprem exatamente o comando.`,
    tags: [
      "reta-final",
      "intensivo-pgm-2026",
      input.language,
      input.topic,
    ],
    editorial_version: "pgm-2026-v1",
    source_reference: INTENSIVE_SIMULATION_SOURCE_REFERENCE,
    is_premium: true,
    status: "active",
  };
}

export const intensiveEnglishQuestions: EditorialImportQuestion[] = [
  intensiveQuestion({
    id: "PGM-INT-EN-001",
    title: "Polite greeting before bedtime",
    statement:
      "Your host sister says she is tired and is going to sleep. Which response is the most natural and polite in this situation?",
    language: "english",
    subcategory: "communication",
    competence: "eng-everyday-communication",
    difficulty: 1,
    correctLabel: "C",
    correctText: "Good night! Sleep well.",
    distractors: [
      "Good morning! Have a productive day.",
      "Good afternoon! See you at lunch.",
      "Congratulations! Enjoy the celebration.",
      "Welcome back! How was your trip?",
    ],
    rationale:
      "Good night is the conventional expression used when someone is leaving to sleep, and sleep well adds a friendly wish appropriate to a host-family context.",
    topic: "greetings",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-002",
    title: "Subject pronoun in context",
    statement:
      "Marta and Julia are exchange students. Complete the sentence correctly: '___ attend the same international school.'",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 1,
    correctLabel: "A",
    correctText: "They",
    distractors: ["Them", "Their", "She", "We"],
    rationale:
      "The blank is the subject of the verb attend and refers to two female students, so the plural subject pronoun they is required.",
    topic: "subject-pronouns",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-003",
    title: "Possessive adjective for a host family",
    statement:
      "Choose the option that correctly completes the message: 'My host parents are kind, and ___ house is close to school.'",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 1,
    correctLabel: "E",
    correctText: "their",
    distractors: ["they", "them", "theirs", "our"],
    rationale:
      "Their is a possessive adjective placed before the noun house and refers to the plural expression host parents.",
    topic: "possessive-adjectives",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-004",
    title: "Verb to be in a school introduction",
    statement:
      "At orientation, a student introduces her classmates. Which sentence uses the present form of the verb to be correctly?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 1,
    correctLabel: "B",
    correctText: "Lucas and Amir are in my class.",
    distractors: [
      "Lucas and Amir is in my class.",
      "I are excited about the program.",
      "She am the student coordinator.",
      "We is ready for the meeting.",
    ],
    rationale:
      "The plural subject Lucas and Amir agrees with are. The other options mismatch singular and plural subjects with forms of to be.",
    topic: "verb-to-be",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-005",
    title: "Present continuous during a video call",
    statement:
      "During a video call, Ana describes an action happening now. Which sentence is correctly formed in the present continuous?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "D",
    correctText: "My classmates are preparing a welcome poster.",
    distractors: [
      "My classmates preparing a welcome poster.",
      "My classmates is prepare a welcome poster.",
      "My classmates are prepare a welcome poster.",
      "My classmates prepares a welcome poster now.",
    ],
    rationale:
      "The present continuous requires a form of be plus the -ing form. The plural subject classmates therefore takes are preparing.",
    topic: "present-continuous",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-006",
    title: "Demonstratives near and far",
    statement:
      "A student points to two suitcases on the other side of the room. Which sentence uses a demonstrative correctly?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "B",
    correctText: "Those suitcases belong to the exchange students.",
    distractors: [
      "This suitcases belong to the exchange students.",
      "That suitcases belongs to the exchange students.",
      "These suitcase belong to the exchange students.",
      "Those suitcase belongs to the exchange students.",
    ],
    rationale:
      "Those refers to plural objects that are far from the speaker, and the plural noun suitcases agrees with the verb belong.",
    topic: "demonstratives",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-007",
    title: "Price expressed with cardinal numbers",
    statement:
      "At a train station, a student asks about a ticket. Which sentence expresses the price clearly and correctly?",
    language: "english",
    subcategory: "vocabulary",
    competence: "eng-contextual-vocabulary",
    difficulty: 1,
    correctLabel: "D",
    correctText: "The return ticket costs twenty-five dollars.",
    distractors: [
      "The return ticket costs twenty-fifth dollars.",
      "The return ticket costs the twenty-five dollar.",
      "The return ticket cost twenty-five of dollars.",
      "The return ticket costs twentieth-five dollars.",
    ],
    rationale:
      "A cardinal number is used to state an exact quantity or price. Twenty-five correctly modifies the plural currency unit dollars.",
    topic: "cardinal-numbers",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-008",
    title: "Indefinite article before a vowel sound",
    statement:
      "Complete the sentence from a travel checklist: 'Remember to pack ___ extra adapter for your electronic devices.'",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 1,
    correctLabel: "A",
    correctText: "an",
    distractors: ["a", "the an", "some", "any"],
    rationale:
      "Extra begins with a vowel sound, so the singular countable noun phrase requires the indefinite article an.",
    topic: "indefinite-articles",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-009",
    title: "Many and much in a study plan",
    statement:
      "Which sentence correctly distinguishes a countable noun from an uncountable noun in the context of exam preparation?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "C",
    correctText: "I do not have much time, but I have many practice questions.",
    distractors: [
      "I do not have many time, but I have much practice questions.",
      "I do not have much times, but I have many practice question.",
      "I do not have a time, but I have much questions.",
      "I do not have many times, but I have a lot question.",
    ],
    rationale:
      "Time is uncountable in this meaning and takes much, while questions is a plural countable noun and takes many.",
    topic: "countable-uncountable",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-010",
    title: "Indefinite pronouns in a notice",
    statement:
      "A notice says that an unidentified student left a passport copy in the library. Which sentence is grammatically correct?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 3,
    correctLabel: "E",
    correctText: "Someone has left a passport copy at the front desk.",
    distractors: [
      "Anyone have left a passport copy at the front desk.",
      "Someone have left their passport copies at front desk yesterday now.",
      "No one has left something passport copy at the front desk.",
      "Anybody are leaving a passport copy at the front desk already.",
    ],
    rationale:
      "Someone refers to an unidentified person in an affirmative statement and functions as a singular subject, so it takes has left.",
    topic: "indefinite-pronouns",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-011",
    title: "Question word for transportation",
    statement:
      "A host parent wants to know the means of transportation a student uses. Which question is correctly formed?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "A",
    correctText: "How do you usually get to school?",
    distractors: [
      "Where do you usually get to school by bus?",
      "What you usually get to school?",
      "How does you usually gets to school?",
      "When transportation do you use to school?",
    ],
    rationale:
      "How asks about manner or means, and the simple-present question correctly uses do plus the base form get with subject you.",
    topic: "question-words",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-012",
    title: "Simple present for routine",
    statement:
      "Which sentence correctly describes a regular school routine rather than an action happening only at this moment?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "C",
    correctText: "The school bus leaves at seven every morning.",
    distractors: [
      "The school bus leave at seven every morning.",
      "The school bus is leave at seven every morning.",
      "The school bus leaving at seven every morning.",
      "The school bus have left at seven every morning tomorrow.",
    ],
    rationale:
      "A timetable and repeated routine use the simple present. The singular subject school bus requires the third-person form leaves.",
    topic: "simple-present",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-013",
    title: "Adverb of frequency placement",
    statement:
      "A student describes a habit during the exchange. Which sentence places the adverb of frequency in the standard position?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 3,
    correctLabel: "B",
    correctText: "I usually call my family after dinner.",
    distractors: [
      "I call usually my family after dinner.",
      "I am call my family usually after dinner.",
      "Usually I calls my family after dinner.",
      "I call my family after usually dinner.",
    ],
    rationale:
      "With an ordinary lexical verb, usually normally appears before the main verb. The subject I also takes the base form call.",
    topic: "adverbs-of-frequency",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-014",
    title: "Prepositions of time in a schedule",
    statement:
      "Choose the sentence that uses prepositions of time correctly in an orientation schedule for exchange students.",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "D",
    correctText: "The meeting is on Monday at 9 a.m.",
    distractors: [
      "The meeting is at Monday in 9 a.m.",
      "The meeting is in Monday on 9 a.m.",
      "The meeting is on Monday in 9 a.m.",
      "The meeting is at Monday on 9 a.m.",
    ],
    rationale:
      "Days of the week take on, while precise clock times take at. The sentence applies both prepositions correctly.",
    topic: "prepositions-of-time",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-015",
    title: "Past form of the verb to be",
    statement:
      "After a school event, a student reports what happened. Which sentence uses the past form of to be correctly?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "E",
    correctText: "The presentations were interesting, but the room was cold.",
    distractors: [
      "The presentations was interesting, but the room were cold.",
      "The presentations were interesting, but the room were cold.",
      "The presentations was interesting, but the room was cold.",
      "The presentations be interesting, but the room was cold.",
    ],
    rationale:
      "The plural subject presentations takes were, whereas the singular subject room takes was.",
    topic: "past-to-be",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-016",
    title: "Past continuous interrupted action",
    statement:
      "Complete the report correctly: 'While we ___ for the train, the station manager announced a delay.'",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 3,
    correctLabel: "D",
    correctText: "were waiting",
    distractors: ["was waiting", "waited", "were wait", "have waited"],
    rationale:
      "The action was in progress when another past event occurred, so the plural subject we requires the past continuous form were waiting.",
    topic: "past-continuous",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-017",
    title: "Prepositions of place in a classroom",
    statement:
      "A teacher gives directions inside the school. Which sentence uses the preposition of place correctly?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "B",
    correctText: "The language lab is between the library and the science room.",
    distractors: [
      "The language lab is between the library to the science room.",
      "The language lab is under the library and the science room side.",
      "The language lab is in front the library and beside of science room.",
      "The language lab is among the library and the science room two.",
    ],
    rationale:
      "Between is used for a position separating two identified places and is followed by the coordinated phrase the library and the science room.",
    topic: "prepositions-of-place",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-018",
    title: "Giving clear directions",
    statement:
      "A visitor asks how to reach the student office. Which instruction is both grammatically correct and practically clear?",
    language: "english",
    subcategory: "communication",
    competence: "eng-everyday-communication",
    difficulty: 2,
    correctLabel: "E",
    correctText: "Go straight, turn left at the stairs, and the office will be on your right.",
    distractors: [
      "Go straightly and turn in left at stairs; office is your right side on.",
      "Walk the straight until left and the office will right you.",
      "Turn to the stairs after go and office on right is being.",
      "Go at straight, turning left before the office right.",
    ],
    rationale:
      "The sequence uses standard direction verbs, a clear landmark and the conventional expression on your right.",
    topic: "directions",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-019",
    title: "Comparative adjective in context",
    statement:
      "Two routes lead to school. Route A takes 25 minutes and Route B takes 40 minutes. Which comparison is correct?",
    language: "english",
    subcategory: "vocabulary",
    competence: "eng-contextual-vocabulary",
    difficulty: 2,
    correctLabel: "A",
    correctText: "Route A is shorter than Route B.",
    distractors: [
      "Route A is more short that Route B.",
      "Route A is shortest than Route B.",
      "Route A is shorter as Route B.",
      "Route A is the more shorter route than Route B.",
    ],
    rationale:
      "Short forms its comparative with -er and is followed by than. The time data confirms that Route A is the shorter route.",
    topic: "comparatives-adjectives",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-020",
    title: "Have and irregular plurals",
    statement:
      "Which sentence correctly uses the verb have and the plural forms needed in a description of a host family's home?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "C",
    correctText: "The family has two children, and both children have their own rooms.",
    distractors: [
      "The family have two childs, and both child has their own rooms.",
      "The family has two childs, and both children has their own roomes.",
      "The family have two children, and both children has their own rooms.",
      "The family has two childrens, and both have theirs own room.",
    ],
    rationale:
      "Family is treated as singular here and takes has; children is the irregular plural of child and takes the plural verb have.",
    topic: "have-singular-plural",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-021",
    title: "Ability and future arrangement",
    statement:
      "A student discusses skills and a future task. Which sentence correctly combines the modal can with the simple future?",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 2,
    correctLabel: "E",
    correctText: "I can speak English, and I will help at the welcome event tomorrow.",
    distractors: [
      "I can to speak English, and I will helps at the welcome event tomorrow.",
      "I cans speak English, and I help will at the welcome event tomorrow.",
      "I can speaking English, and I will helped at the welcome event tomorrow.",
      "I can spoke English, and I will to help at the welcome event tomorrow.",
    ],
    rationale:
      "Can and will are modal auxiliaries followed by the base form of the verb, producing can speak and will help.",
    topic: "modal-can-simple-future",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-022",
    title: "Tense sequence in an exchange update",
    statement:
      "Choose the update in which the simple past, present perfect and superlative are all used correctly and logically.",
    language: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    difficulty: 3,
    correctLabel: "D",
    correctText: "I arrived last month, I have made new friends, and this has been the most challenging week so far.",
    distractors: [
      "I have arrived last month, I made new friends so far, and this is the more challenging week.",
      "I arrived last month, I have make new friends, and this has been the challengest week so far.",
      "I did arrived last month, I has made new friends, and this was the most challenging week so far yet.",
      "I arrive last month, I have made new friends yesterday, and this has been the more challenging week.",
    ],
    rationale:
      "A finished time marker takes simple past, an experience connected to the present takes present perfect, and most challenging is the correct superlative form.",
    topic: "past-present-perfect-superlative",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-023",
    title: "Explicit information in a school email",
    statement:
      "Read the email: 'The international club meets every Wednesday at 3:30 p.m. in Room 12. New students should bring their school ID.' What must a new student bring?",
    language: "english",
    subcategory: "reading-comprehension",
    competence: "eng-identify-main-idea",
    difficulty: 2,
    correctLabel: "C",
    correctText: "A school ID.",
    distractors: ["A passport.", "A language certificate.", "A sports uniform.", "A printed timetable."],
    rationale:
      "The email explicitly states that new students should bring their school ID. No other document or object is required in the text.",
    topic: "reading-explicit-information",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-024",
    title: "Main purpose of a host-family message",
    statement:
      "Read the message: 'Dinner is usually at 7 p.m. If you will be late, please text us before 6:30 so we can save your meal.' What is the main purpose of the message?",
    language: "english",
    subcategory: "reading-comprehension",
    competence: "eng-identify-main-idea",
    difficulty: 2,
    correctLabel: "A",
    correctText: "To explain the dinner routine and how to communicate a delay.",
    distractors: [
      "To forbid the student from eating outside the house.",
      "To change dinner permanently to 6:30 p.m.",
      "To ask the student to cook every evening.",
      "To announce that no meal will be available after school.",
    ],
    rationale:
      "The message combines the usual dinner time with a specific request to communicate when arriving late; it does not impose the stronger restrictions in the distractors.",
    topic: "reading-main-idea",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-025",
    title: "Inference from a travel notice",
    statement:
      "Read the notice: 'Platform 4 is closed for maintenance. Passengers for the 10:15 train should follow the blue signs to Platform 6.' What can be inferred?",
    language: "english",
    subcategory: "reading-comprehension",
    competence: "eng-infer-implicit-information",
    difficulty: 3,
    correctLabel: "B",
    correctText: "The 10:15 train will depart from a different platform than usual.",
    distractors: [
      "The 10:15 train has been cancelled for the entire day.",
      "All passengers must leave the station immediately.",
      "Platform 6 is closed because of maintenance.",
      "Only international passengers may use Platform 6.",
    ],
    rationale:
      "The instruction redirects passengers from closed Platform 4 to Platform 6, which supports a platform change but not cancellation or restricted access.",
    topic: "reading-inference",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-026",
    title: "Vocabulary in an academic context",
    statement:
      "Read the sentence: 'Students are encouraged to attend the optional workshop, especially if they need extra practice.' In this context, 'encouraged' means:",
    language: "english",
    subcategory: "vocabulary",
    competence: "eng-contextual-vocabulary",
    difficulty: 3,
    correctLabel: "C",
    correctText: "advised or motivated to participate",
    distractors: [
      "forced to participate under punishment",
      "prevented from joining the activity",
      "automatically registered without permission",
      "excused from all future classes",
    ],
    rationale:
      "Encouraged expresses positive advice or motivation. The word optional confirms that attendance is recommended rather than compulsory.",
    topic: "reading-vocabulary-context",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-027",
    title: "Sequence of events in a routine",
    statement:
      "Read the routine: 'Before class, Nina checks the online platform. During lunch, she answers messages from home. After school, she reviews new vocabulary.' What does Nina do last?",
    language: "english",
    subcategory: "reading-comprehension",
    competence: "eng-identify-main-idea",
    difficulty: 3,
    correctLabel: "E",
    correctText: "She reviews new vocabulary.",
    distractors: [
      "She checks the online platform.",
      "She answers messages before class.",
      "She has lunch after reviewing vocabulary.",
      "She sends the school timetable to her family.",
    ],
    rationale:
      "The chronological markers before class, during lunch and after school show that reviewing vocabulary is the final action mentioned.",
    topic: "reading-sequence",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-028",
    title: "Purpose of a student reflection",
    statement:
      "Read the reflection: 'At first, I avoided speaking because I was afraid of mistakes. Then I joined the drama club, where everyone was patient. Now I participate more in class.' What change does the student describe?",
    language: "english",
    subcategory: "reading-comprehension",
    competence: "eng-infer-implicit-information",
    difficulty: 3,
    correctLabel: "D",
    correctText: "The student became more confident about communicating.",
    distractors: [
      "The student decided to stop attending regular classes.",
      "The student learned that mistakes are never accepted at school.",
      "The student left the drama club because it was too competitive.",
      "The student became less interested in meeting classmates.",
    ],
    rationale:
      "The movement from avoiding speech to participating more indicates increased confidence, supported by the patient environment of the drama club.",
    topic: "reading-inference-change",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-029",
    title: "Evaluating evidence in an exchange blog",
    statement:
      "Read the blog excerpt: 'The first week felt overwhelming: new bus routes, unfamiliar meals, and fast conversations. By Friday, I had created a route map, tried two local dishes, and asked classmates to repeat key instructions.' Which conclusion is best supported?",
    language: "english",
    subcategory: "reading-comprehension",
    competence: "eng-infer-implicit-information",
    difficulty: 4,
    correctLabel: "B",
    correctText: "The student responded to initial difficulties with practical adaptation strategies.",
    distractors: [
      "The student solved every difficulty without asking anyone for help.",
      "The student disliked all local food and refused to travel by bus.",
      "The school changed its rules to make the week easier for the student.",
      "The student concluded that living abroad required no preparation.",
    ],
    rationale:
      "The listed actions directly address transportation, food and communication challenges, showing adaptation rather than complete independence or avoidance.",
    topic: "reading-evidence-synthesis",
  }),
  intensiveQuestion({
    id: "PGM-INT-EN-030",
    title: "Tone and implicit recommendation",
    statement:
      "Read the advice: 'You may want to keep a small notebook during your first month. Writing down expressions, bus numbers and questions for your coordinator can save time later.' What is the writer mainly suggesting?",
    language: "english",
    subcategory: "reading-comprehension",
    competence: "eng-infer-implicit-information",
    difficulty: 4,
    correctLabel: "A",
    correctText: "Recording practical information can make adaptation more organized.",
    distractors: [
      "Students should avoid asking coordinators any questions.",
      "Only vocabulary should be written in the notebook.",
      "Bus information is unnecessary after the first day.",
      "A notebook can replace all official travel documents.",
    ],
    rationale:
      "The examples cover language, transportation and pending questions, so the recommendation is broader organization, not avoidance or replacement of official documents.",
    topic: "reading-implicit-recommendation",
  }),
];

export const intensiveSpanishQuestions: EditorialImportQuestion[] = [
  intensiveQuestion({
    id: "PGM-INT-ES-001",
    title: "Saludo adecuado al llegar",
    statement:
      "Una estudiante llega por la mañana a la casa de su familia anfitriona. ¿Cuál es el saludo más natural y cortés?",
    language: "spanish",
    subcategory: "comunicacion",
    competence: "spa-everyday-communication",
    difficulty: 1,
    correctLabel: "B",
    correctText: "Buenos días, mucho gusto.",
    distractors: [
      "Buenas noches, hasta mañana.",
      "Buen provecho, nos vemos luego.",
      "Felicidades, que cumplas muchos años.",
      "Perdón, ¿dónde está la estación?",
    ],
    rationale:
      "Buenos días corresponde al período de la mañana y mucho gusto es una fórmula adecuada para un primer encuentro con la familia anfitriona.",
    topic: "saludos-despedidas",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-002",
    title: "Pronombre personal sujeto",
    statement:
      "Lucía y Carmen participan en el intercambio. Completa correctamente: '___ estudian en la misma escuela.'",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 1,
    correctLabel: "D",
    correctText: "Ellas",
    distractors: ["Las", "Les", "Ella", "Nosotras"],
    rationale:
      "Ellas es el pronombre personal sujeto femenino plural que retoma a Lucía y Carmen y concuerda con el verbo estudian.",
    topic: "pronombres-personales",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-003",
    title: "Posesivo antes del sustantivo",
    statement:
      "Completa el mensaje de una estudiante: 'Mis anfitriones son amables y ___ hijos estudian conmigo.'",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 1,
    correctLabel: "A",
    correctText: "sus",
    distractors: ["ellos", "suyos", "su", "nuestros"],
    rationale:
      "Sus funciona como posesivo ante el sustantivo plural hijos y remite a los anfitriones mencionados en la primera parte.",
    topic: "posesivos",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-004",
    title: "Verbo ser para identidad",
    statement:
      "En una presentación escolar, ¿qué oración utiliza correctamente el verbo ser para indicar identidad y nacionalidad?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 1,
    correctLabel: "E",
    correctText: "Somos estudiantes brasileños de intercambio.",
    distractors: [
      "Estamos estudiantes brasileños de intercambio.",
      "Soy estudiantes brasileños de intercambio.",
      "Es estudiantes brasileños de intercambio.",
      "Son estudiante brasileño de intercambio nosotros.",
    ],
    rationale:
      "Ser se usa para identidad y origen; el sujeto implícito nosotros exige somos y el atributo debe aparecer en plural.",
    topic: "verbo-ser",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-005",
    title: "Verbo estar para ubicación",
    statement:
      "Una coordinadora explica dónde queda la oficina. ¿Cuál oración utiliza correctamente el verbo estar?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "C",
    correctText: "La oficina está al lado de la biblioteca.",
    distractors: [
      "La oficina es al lado de la biblioteca.",
      "La oficina están al lado de la biblioteca.",
      "La oficina estoy al lado de la biblioteca.",
      "La oficina estar al lado de la biblioteca.",
    ],
    rationale:
      "Estar expresa ubicación física y concuerda en singular con la oficina, por lo que la forma correcta es está.",
    topic: "verbo-estar",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-006",
    title: "Verbo tener y edad",
    statement:
      "Durante una inscripción, un alumno informa su edad. ¿Cuál frase sigue la estructura correcta en español?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "E",
    correctText: "Tengo dieciséis años.",
    distractors: ["Soy dieciséis años.", "Estoy con dieciséis años.", "Tiene dieciséis años yo.", "Tengo dieciséis año."],
    rationale:
      "La edad se expresa con el verbo tener. La primera persona singular es tengo y años debe aparecer en plural.",
    topic: "verbo-tener",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-007",
    title: "Presente de indicativo habitual",
    statement:
      "¿Qué oración describe correctamente una rutina escolar en presente de indicativo?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 1,
    correctLabel: "C",
    correctText: "Mi clase empieza a las ocho todos los días.",
    distractors: [
      "Mi clase empezan a las ocho todos los días.",
      "Mi clase empezar a las ocho todos los días.",
      "Mi clase empezamos a las ocho todos los días.",
      "Mi clase está empezar a las ocho todos los días.",
    ],
    rationale:
      "El sujeto singular mi clase exige la tercera persona singular empieza, y todos los días confirma el valor habitual del presente.",
    topic: "presente-indicativo",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-008",
    title: "Artículos definidos e indefinidos",
    statement:
      "Completa la frase de una guía de viaje: 'Necesito comprar ___ adaptador y guardar ___ documentos en la mochila.'",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 1,
    correctLabel: "B",
    correctText: "un / los",
    distractors: ["una / el", "unos / la", "el / unas", "un / la"],
    rationale:
      "Adaptador es masculino singular e introduce un objeto no especificado, mientras documentos es masculino plural y se refiere a documentos definidos.",
    topic: "articulos",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-009",
    title: "Concordancia de género y número",
    statement:
      "Una alumna describe dos actividades de la escuela. ¿Qué opción presenta concordancia correcta de género y número?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "D",
    correctText: "Las actividades culturales son interesantes.",
    distractors: [
      "Los actividades cultural son interesante.",
      "Las actividad culturales es interesantes.",
      "La actividades cultural son interesantes.",
      "Las actividades culturales es interesante.",
    ],
    rationale:
      "Artículo, sustantivo, adjetivo y verbo deben concordar con el sujeto femenino plural las actividades culturales.",
    topic: "genero-numero",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-010",
    title: "Adjetivo y posición natural",
    statement:
      "¿Cuál oración utiliza un adjetivo de forma correcta y natural al describir una experiencia de intercambio?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 3,
    correctLabel: "A",
    correctText: "Fue una experiencia desafiante pero enriquecedora.",
    distractors: [
      "Fue una experiencia desafiantemente pero enriquecimiento.",
      "Fue un experiencia desafiantes pero enriquecedora.",
      "Fue una experiencia desafiante pero enriquecedores.",
      "Fue una desafiante experiencia pero enriquecer.",
    ],
    rationale:
      "Los adjetivos desafiante y enriquecedora califican a experiencia; enriquecedora concuerda en femenino singular y la coordinación es natural.",
    topic: "adjetivos",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-011",
    title: "Preposiciones básicas en contexto",
    statement:
      "Completa correctamente la indicación: 'Voy ___ la biblioteca ___ estudiar con mis compañeros.'",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "C",
    correctText: "a / para",
    distractors: ["en / por", "de / a", "por / en", "con / desde"],
    rationale:
      "Ir a indica destino y para introduce la finalidad de la acción: estudiar con los compañeros.",
    topic: "preposiciones",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-012",
    title: "Interrogativo para ubicación",
    statement:
      "Un estudiante busca la sala de orientación. ¿Cuál pregunta está correctamente formulada para pedir la ubicación?",
    language: "spanish",
    subcategory: "comunicacion",
    competence: "spa-everyday-communication",
    difficulty: 2,
    correctLabel: "A",
    correctText: "¿Dónde está la sala de orientación?",
    distractors: [
      "¿Qué está la sala de orientación?",
      "¿Dónde es estando la sala de orientación?",
      "¿Cuál lugar está de la sala orientación?",
      "¿Cuándo está la sala de orientación lugar?",
    ],
    rationale:
      "Dónde pregunta por ubicación y la estructura estar más lugar es la adecuada para localizar una sala.",
    topic: "interrogativos",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-013",
    title: "Demostrativos según distancia",
    statement:
      "La estudiante señala unos formularios que están lejos de ella. ¿Qué frase utiliza el demostrativo adecuado?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 3,
    correctLabel: "E",
    correctText: "Aquellos formularios son para los nuevos alumnos.",
    distractors: [
      "Este formularios son para los nuevos alumnos.",
      "Esa formularios es para los nuevos alumnos.",
      "Estos formulario son para los nuevos alumnos.",
      "Aquella formularios son para los nuevos alumnos.",
    ],
    rationale:
      "Aquellos indica distancia respecto de la hablante y concuerda en masculino plural con formularios.",
    topic: "demostrativos",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-014",
    title: "Adverbio de frecuencia",
    statement:
      "¿Qué oración coloca correctamente el adverbio de frecuencia al hablar de una costumbre durante el intercambio?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "B",
    correctText: "Normalmente desayuno con mi familia anfitriona.",
    distractors: [
      "Desayuno normal con mi familia anfitriona siempremente.",
      "Normalmente desayuna yo con mi familia anfitriona.",
      "Yo normalidad desayuno con mi familia anfitriona.",
      "Desayunando normalmente yo con mi familia anfitriona cada.",
    ],
    rationale:
      "Normalmente funciona como adverbio de frecuencia y puede aparecer al inicio; desayuno concuerda con la primera persona singular.",
    topic: "adverbios-frecuencia",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-015",
    title: "Verbo regular en presente",
    statement:
      "Completa la frase: 'Mis compañeros y yo ___ español después de clase para mejorar la conversación.'",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "D",
    correctText: "practicamos",
    distractors: ["practican", "practico", "practicáis", "practicar"],
    rationale:
      "El sujeto mis compañeros y yo equivale a nosotros, por lo que el verbo regular practicar toma la forma practicamos.",
    topic: "verbos-regulares",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-016",
    title: "Verbo irregular en una rutina",
    statement:
      "Un alumno explica cómo llega a la escuela. ¿Cuál oración conjuga correctamente un verbo irregular en presente?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 3,
    correctLabel: "A",
    correctText: "Yo voy en autobús, pero mi hermana viene caminando.",
    distractors: [
      "Yo va en autobús, pero mi hermana ven caminando.",
      "Yo voy en autobús, pero mi hermana vienes caminando.",
      "Yo ir en autobús, pero mi hermana viene caminando.",
      "Yo vengo en autobús, pero mi hermana voy caminando.",
    ],
    rationale:
      "La primera persona de ir es voy y la tercera persona singular de venir es viene; ambas formas concuerdan con sus sujetos.",
    topic: "verbos-irregulares",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-017",
    title: "Perífrasis estar más gerundio",
    statement:
      "Durante una llamada, una estudiante describe lo que ocurre en ese momento. ¿Qué frase es correcta?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "D",
    correctText: "Estamos preparando una presentación sobre Brasil.",
    distractors: [
      "Estamos preparar una presentación sobre Brasil.",
      "Somos preparando una presentación sobre Brasil.",
      "Estamos preparados una presentación sobre Brasil.",
      "Están preparando nosotros una presentación sobre Brasil.",
    ],
    rationale:
      "La acción en desarrollo se expresa con estar conjugado más gerundio: estamos preparando.",
    topic: "perifrasis-gerundio",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-018",
    title: "Pretérito indefinido",
    statement:
      "Ayer terminó una excursión escolar. ¿Qué oración utiliza correctamente el pasado simple para un evento concluido?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 3,
    correctLabel: "C",
    correctText: "Visitamos el museo y aprendimos sobre la historia local.",
    distractors: [
      "Visitamos mañana el museo y aprendemos ayer sobre la historia local.",
      "Hemos visitado ayer el museo y aprendimos mañana sobre la historia local.",
      "Visitábamos una vez ayer y aprenderemos sobre la historia local.",
      "Visitaron nosotros el museo y aprendió sobre la historia local.",
    ],
    rationale:
      "Ayer marca un período concluido y el sujeto nosotros exige las formas visitamos y aprendimos en pretérito indefinido.",
    topic: "pasado-simple",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-019",
    title: "Futuro próximo",
    statement:
      "Una estudiante habla de un plan para el fin de semana. ¿Cuál frase usa correctamente la estructura ir a más infinitivo?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "E",
    correctText: "Vamos a visitar una feria cultural el sábado.",
    distractors: [
      "Vamos visitar una feria cultural el sábado.",
      "Vamos a visitamos una feria cultural el sábado.",
      "Vanos a visitar una feria cultural el sábado.",
      "Vamos de visitar una feria cultural el sábado.",
    ],
    rationale:
      "El futuro próximo se construye con ir conjugado, la preposición a y un infinitivo: vamos a visitar.",
    topic: "futuro-proximo",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-020",
    title: "Comparativo de desigualdad",
    statement:
      "El trayecto A dura 20 minutos y el trayecto B dura 35. ¿Qué comparación expresa correctamente la diferencia?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "B",
    correctText: "El trayecto A es más corto que el trayecto B.",
    distractors: [
      "El trayecto A es muy corto de el trayecto B.",
      "El trayecto A es más corto como el trayecto B.",
      "El trayecto A es el más corto que el trayecto B dos.",
      "El trayecto A está menos largo de que el trayecto B.",
    ],
    rationale:
      "El comparativo de superioridad se forma con más, adjetivo y que; los datos muestran que A tiene menor duración.",
    topic: "comparativos",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-021",
    title: "Superlativo relativo",
    statement:
      "Tres actividades recibieron puntuaciones de 7, 8 y 10. ¿Cuál frase describe correctamente la actividad con puntuación 10?",
    language: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    difficulty: 2,
    correctLabel: "D",
    correctText: "Fue la actividad más interesante del programa.",
    distractors: [
      "Fue la actividad más interesante que todas del programa.",
      "Fue la actividad interesantísima más de programa.",
      "Fue el actividad más interesante de la programa.",
      "Fue la más actividad interesante del programa.",
    ],
    rationale:
      "El superlativo relativo se forma con artículo definido, sustantivo, más y adjetivo, seguido del grupo de referencia del programa.",
    topic: "superlativos",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-022",
    title: "Falso cognado en contexto",
    statement:
      "Lee: 'La coordinadora está embarazada y dejará el trabajo durante algunos meses.' ¿Qué significa 'embarazada' en esta frase?",
    language: "spanish",
    subcategory: "vocabulario",
    competence: "spa-recognize-false-cognates",
    difficulty: 3,
    correctLabel: "E",
    correctText: "Está esperando un bebé.",
    distractors: [
      "Está avergonzada por un error.",
      "Está ocupada con muchos documentos.",
      "Está enferma por haber viajado.",
      "Está confundida con el horario.",
    ],
    rationale:
      "Embarazada significa gestante en español y no equivale al portugués embaraçada; el alejamiento temporal refuerza ese sentido.",
    topic: "falsos-cognatos",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-023",
    title: "Información explícita en un aviso",
    statement:
      "Lee el aviso: 'El club de idiomas se reúne los jueves a las cuatro en el aula 8. Los nuevos alumnos deben llevar su tarjeta escolar.' ¿Qué deben llevar?",
    language: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    difficulty: 2,
    correctLabel: "B",
    correctText: "La tarjeta escolar.",
    distractors: ["El pasaporte.", "Un diccionario bilingüe.", "La autorización de viaje.", "El uniforme deportivo."],
    rationale:
      "El aviso menciona de manera explícita la tarjeta escolar como requisito para los nuevos alumnos.",
    topic: "lectura-informacion-explicita",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-024",
    title: "Idea principal de un mensaje familiar",
    statement:
      "Lee: 'Cenamos a las siete. Si vas a llegar tarde, avísanos antes de las seis y media para guardar tu comida.' ¿Cuál es la finalidad principal?",
    language: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    difficulty: 2,
    correctLabel: "C",
    correctText: "Explicar la rutina de la cena y cómo avisar un retraso.",
    distractors: [
      "Prohibir que el estudiante coma fuera de casa.",
      "Cambiar definitivamente la cena a las seis y media.",
      "Pedir que el estudiante cocine para toda la familia.",
      "Informar que no habrá comida después de la escuela.",
    ],
    rationale:
      "El mensaje presenta el horario habitual y una instrucción concreta para comunicar retrasos, sin establecer las prohibiciones de los distractores.",
    topic: "lectura-idea-principal",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-025",
    title: "Inferencia en un aviso de transporte",
    statement:
      "Lee: 'El andén 2 está cerrado por mantenimiento. Los pasajeros del tren de las 10:20 deben seguir las señales verdes hasta el andén 5.' ¿Qué se puede inferir?",
    language: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    difficulty: 3,
    correctLabel: "A",
    correctText: "El tren saldrá desde un andén diferente al habitual.",
    distractors: [
      "El tren fue cancelado durante todo el día.",
      "Todos deben abandonar la estación inmediatamente.",
      "El andén 5 también está cerrado por mantenimiento.",
      "Solo los pasajeros internacionales pueden usar el andén 5.",
    ],
    rationale:
      "La redirección del andén cerrado al andén 5 indica un cambio de lugar de salida, no una cancelación ni una restricción de pasajeros.",
    topic: "lectura-inferencia",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-026",
    title: "Vocabulario académico en contexto",
    statement:
      "Lee: 'La asistencia al taller es voluntaria, pero se recomienda a quienes necesitan practicar más.' En este contexto, 'voluntaria' significa:",
    language: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    difficulty: 3,
    correctLabel: "B",
    correctText: "que cada estudiante puede decidir si participa",
    distractors: [
      "que todos deben participar obligatoriamente",
      "que solo los profesores pueden asistir",
      "que la actividad fue cancelada",
      "que participar elimina las clases regulares",
    ],
    rationale:
      "Voluntaria indica elección personal. La recomendación posterior confirma que la participación es aconsejada, pero no obligatoria.",
    topic: "lectura-vocabulario-contexto",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-027",
    title: "Secuencia de una rutina",
    statement:
      "Lee: 'Antes de clase, Pablo revisa la plataforma. Durante el almuerzo, llama a su familia. Después de la escuela, estudia vocabulario.' ¿Qué hace al final?",
    language: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    difficulty: 3,
    correctLabel: "A",
    correctText: "Estudia vocabulario.",
    distractors: ["Revisa la plataforma.", "Llama a su familia antes de clase.", "Almuerza después de estudiar.", "Envía el horario a la escuela."],
    rationale:
      "Los marcadores antes, durante y después ordenan las acciones; estudiar vocabulario ocurre después de la escuela y es la última.",
    topic: "lectura-secuencia",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-028",
    title: "Cambio en una experiencia escolar",
    statement:
      "Lee: 'Al principio evitaba hablar por miedo a equivocarme. Después entré en el club de teatro, donde todos tenían paciencia. Ahora participo más en clase.' ¿Qué cambio ocurrió?",
    language: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    difficulty: 3,
    correctLabel: "E",
    correctText: "La estudiante ganó confianza para comunicarse.",
    distractors: [
      "La estudiante dejó de asistir a las clases regulares.",
      "La estudiante descubrió que la escuela no acepta errores.",
      "La estudiante abandonó el teatro por exceso de competencia.",
      "La estudiante perdió el interés por sus compañeros.",
    ],
    rationale:
      "El paso de evitar hablar a participar más, favorecido por un ambiente paciente, evidencia mayor confianza comunicativa.",
    topic: "lectura-inferencia-cambio",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-029",
    title: "Síntesis de estrategias de adaptación",
    statement:
      "Lee: 'La primera semana fue intensa: rutas nuevas, comidas desconocidas y conversaciones rápidas. El viernes ya tenía un mapa, había probado dos platos y pedía que repitieran las instrucciones.' ¿Qué conclusión está mejor sustentada?",
    language: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    difficulty: 4,
    correctLabel: "C",
    correctText: "La estudiante enfrentó las dificultades con estrategias prácticas de adaptación.",
    distractors: [
      "La estudiante resolvió todo sin pedir ayuda a nadie.",
      "La estudiante rechazó la comida local y dejó de usar el transporte.",
      "La escuela cambió todas sus reglas para ayudarla.",
      "La estudiante concluyó que prepararse antes del viaje era innecesario.",
    ],
    rationale:
      "El mapa, la prueba de alimentos y la solicitud de repetición responden directamente a los problemas iniciales y muestran adaptación activa.",
    topic: "lectura-sintesis-evidencias",
  }),
  intensiveQuestion({
    id: "PGM-INT-ES-030",
    title: "Recomendación implícita en un consejo",
    statement:
      "Lee: 'Conviene llevar una libreta durante el primer mes. Anotar expresiones, números de autobús y preguntas para la coordinación puede ahorrar tiempo.' ¿Qué recomienda principalmente el autor?",
    language: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    difficulty: 4,
    correctLabel: "D",
    correctText: "Registrar información práctica ayuda a organizar la adaptación.",
    distractors: [
      "Evitar hacer preguntas a la coordinación.",
      "Anotar únicamente palabras nuevas del idioma.",
      "Dejar de consultar los horarios de transporte después del primer día.",
      "Sustituir los documentos oficiales por una libreta personal.",
    ],
    rationale:
      "Los ejemplos abarcan idioma, transporte y dudas pendientes, por lo que la recomendación central es organizar información útil durante la adaptación.",
    topic: "lectura-recomendacion-implicita",
  }),
];

export const intensiveSimulationQuestions: EditorialImportQuestion[] = [
  ...intensiveEnglishQuestions,
  ...intensiveSpanishQuestions,
];
