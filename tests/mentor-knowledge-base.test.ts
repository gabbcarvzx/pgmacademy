import assert from "node:assert/strict";

import { mentorKnowledgeBase } from "../src/lib/mentor/knowledge-base";
import { pgm2026OfficialSnapshot } from "../src/lib/official/pgm-2026";

assert.match(mentorKnowledgeBase, /2\.000 vagas/);
assert.match(mentorKnowledgeBase, /1\.400 para inglês/);
assert.match(mentorKnowledgeBase, /600 para espanhol/);
assert.match(mentorKnowledgeBase, /30 questões/);
assert.match(mentorKnowledgeBase, /5 questões/);
assert.match(mentorKnowledgeBase, /90 e 150 palavras/);
assert.match(mentorKnowledgeBase, /Entrevista psicossocial/);
assert.match(mentorKnowledgeBase, /Canadá, Estados Unidos, Reino Unido/);
assert.match(mentorKnowledgeBase, /Argentina, Espanha/);
assert.match(mentorKnowledgeBase, new RegExp(pgm2026OfficialSnapshot.editalUrl));

assert.doesNotMatch(mentorKnowledgeBase, /700 vagas/);
assert.doesNotMatch(mentorKnowledgeBase, /50 para Chile/);
assert.doesNotMatch(mentorKnowledgeBase, /Chile/);

console.log("Mentor knowledge base passed");
