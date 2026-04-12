import { parseLRC } from '../apps/web/src/lib/lrc-parser';

const sample = `
[00:15.30] Hello from the outside
[00:18.20] At least I can say that I've tried
[00:22.00] To tell you I'm sorry
`;

console.log(parseLRC(sample));
