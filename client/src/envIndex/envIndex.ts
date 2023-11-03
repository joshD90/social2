const baseUrl = import.meta.env.VITE_BASE_URL;
const downVoteCutOff = import.meta.env.VITE_DOWNVOTE_CUTOFF;

const envIndex = { urls: { baseUrl }, comments: { downVoteCutOff } };

export default envIndex;
