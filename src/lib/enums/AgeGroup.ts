enum AgeGroup {
  AllAges = 'All Ages',
  Adults = 'Adults (19+)',
  Youth = 'Youth (< 19)',
  Mature = 'Mature (50+)',
}

type AgeGroupOptions = {
  label: string;
  value: string;
};

export const ageGroupOptions: AgeGroupOptions[] = Object.entries(AgeGroup).map(
  ([label, value]) => ({
    label: value,
    value: label,
  })
);

export default AgeGroup;
