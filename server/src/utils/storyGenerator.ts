export const generateStory = (title: string, mood?: string) => {
  const baseTemplates = [
    `This piece, "${title}", was born in silence. It exists only once.`,
    `"${title}" carries a fragment of something unrepeatable.`,
    `There was a moment when "${title}" came into existence — and it cannot be recreated.`,
    `"${title}" is not just art. It is a captured emotion that now belongs to someone.`,
    `Created in solitude, "${title}" reflects a story that will never exist again.`,
    `In the quiet hours of creation, "${title}" emerged as something singular.`,
    `"${title}" holds a piece of time that cannot be repeated.`,
    `This work, "${title}", was shaped by a single moment of inspiration.`,
    `"${title}" contains an emotion that was felt only once.`,
    `Born from a unique spark, "${title}" remains forever unrepeatable.`,
  ];

  const moodLines = {
    dark: "It holds a quiet darkness that speaks without words, a shadow that lingers in the soul.",
    emotional:
      "It carries a deep emotional weight that stays with you, echoing long after you've turned away.",
    love: "It reflects something intimate and deeply personal, a whisper of connection that transcends time.",
    power:
      "It radiates a sense of silent strength, a quiet authority that commands attention without demanding it.",
    mystery:
      "It holds secrets that unfold slowly, revealing layers of meaning that deepen with each viewing.",
    serenity:
      "It brings a peaceful calm, like a quiet meadow at dawn, undisturbed and profoundly still.",
  };

  const randomBase =
    baseTemplates[Math.floor(Math.random() * baseTemplates.length)];

  let story = randomBase;

  if (mood && moodLines[mood as keyof typeof moodLines]) {
    story += ` ${moodLines[mood as keyof typeof moodLines]}`;
  }

  // Add the mandatory brand line
  story += " This piece exists only once. And now, it belongs to someone.";

  return story;
};
