interface DraftResult {
  subject: string
  body: string
}

interface ResearchItem {
  name: string
  why: string
  tag: string
}

interface ResearchResult {
  title: string
  items: ResearchItem[]
}

export function simulateDraft(context: string, recipient: string, tone: string): DraftResult {
  const toneMap: Record<string, { open: string; close: string }> = {
    professional: {
      open: `Hi ${recipient || 'there'},\n\nI wanted to reach out regarding`,
      close: '\n\nLooking forward to your response.\n\nBest,\n[Your name]',
    },
    casual: {
      open: `Hey ${recipient || 'there'}!\n\nJust wanted to shoot you a message about`,
      close: '\n\nLet me know what you think.\n\n— [Your name]',
    },
    assertive: {
      open: `${recipient || 'Hi'},\n\nI need to address`,
      close:
        "\n\nI expect a response by end of week. If I don't hear back, I'll follow up directly.\n\n[Your name]",
    },
  }
  const t = toneMap[tone] ?? toneMap['professional']

  const bodyCore =
    context ||
    "the matter we discussed. Based on what we've covered, I believe the next steps are clear and I'd like to confirm we're aligned before moving forward."

  return {
    subject:
      tone === 'assertive'
        ? `Action Required: ${context.slice(0, 40) || 'Follow-Up Needed'}`
        : `Re: ${context.slice(0, 40) || 'Touching Base'}`,
    body: `${t.open} ${bodyCore}.${t.close}`,
  }
}

export function simulateResearch(topic: string): ResearchResult {
  const defaultItems: ResearchItem[] = [
    {
      name: 'Recycle Records, Osaka',
      why: 'Legendary hidden crate-digging spot — Japanese pressings, unknown stock',
      tag: '🎵 Vinyl',
    },
    {
      name: 'Haight-Ashbury Vintage (SF)',
      why: 'Curated 90s streetwear blocks — away from tourist Haight St corridor',
      tag: '👟 Streetwear',
    },
    {
      name: 'Disk Union, Tokyo',
      why: 'Multi-floor music store loved by locals, minimal tourist presence',
      tag: '🎵 Vinyl',
    },
    {
      name: 'Kabukicho Ramen Alley',
      why: 'Late-night ramen in back alleys — no Yelp, no tourist menus',
      tag: '🍜 Food',
    },
  ]
  const title = topic
    ? `Personalized picks for: "${topic.slice(0, 50)}"`
    : 'Your personalized recommendations'
  return { title, items: defaultItems }
}

export function summarizeMessage(fullText: string, sender: string): { summary: string; responseChips: string[] } {
  const lower = fullText.toLowerCase()

  let summary: string
  if (fullText.length < 80) {
    summary = fullText
  } else {
    const sentences = fullText.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    summary = sentences.slice(0, 2).join('. ').trim() + '.'
  }

  const chips: string[] = []

  if (lower.includes('free') || lower.includes('available') || lower.includes('meet') || lower.includes('hang')) {
    chips.push("I'm free Thursday after 3pm", "Can't make it — let's reschedule", 'Maybe next week?')
  } else if (lower.includes('invoice') || lower.includes('payment') || lower.includes('budget')) {
    chips.push('On it — sending this week', 'Need more time on this', "Let's discuss the numbers")
  } else if (lower.includes('presentation') || lower.includes('project') || lower.includes('timeline')) {
    chips.push("Sounds good, let's sync", "I'll follow up with Sarah", 'Can we push the deadline?')
  } else {
    chips.push('Got it, thanks!', "I'll get back to you soon", "Let's talk more about this")
  }

  return { summary: `From ${sender}: ${summary}`, responseChips: chips }
}
