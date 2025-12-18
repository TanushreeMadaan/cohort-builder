export const NORMALIZATION_RULES: Record<string, any> = {
    rnaseq_availability: {
      type: 'boolean',
      trueValues: ['y', 'yes', 'true', 'available', 'present', 'sequenced'],
      falseValues: ['n', 'no', 'false', 'unavailable', 'absent']
    },
  
    exomeseq_available: {
      type: 'boolean',
      trueValues: ['y', 'yes', 'true', 'available'],
      falseValues: ['n', 'no', 'false']
    },
  
    gender: {
      type: 'categorical',
      aliases: {
        female: ['female', 'f', 'woman', 'women'],
        male: ['male', 'm', 'man', 'men']
      }
    },
  
    is_replapse: {
      type: 'boolean',
      trueValues: ['true', 'yes', 'relapse', 'relapsed'],
      falseValues: ['false', 'no']
    }
  };
  
  export function normalizeValue(column: string, rawValue: any): any {
    if (rawValue === null || rawValue === undefined) return rawValue;
  
    const rule = NORMALIZATION_RULES[column];
    if (!rule) return rawValue;
  
    const value = String(rawValue).toLowerCase().trim();
  
    if (rule.type === 'boolean') {
      if (rule.trueValues.some((v: string) => value.includes(v))) return 'y';
      if (rule.falseValues.some((v: string) => value.includes(v))) return 'n';
    }
  
    if (rule.type === 'categorical') {
      for (const [canonical, variants] of Object.entries(rule.aliases)) {
        if (Array.isArray(variants)) {
          if ((variants as string[]).some((v: string) => value.includes(v))) {
            return canonical;
          }
        }
      }
    }
  
    return rawValue;
  }
  