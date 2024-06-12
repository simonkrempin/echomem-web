const baseDate = new Date();
const today = baseDate.toISOString().split('T')[0];
baseDate.setDate(baseDate.getDate() - 1);
const yesterday = baseDate.toISOString().split('T')[0];
baseDate.setDate(baseDate.getDate() + 2);
const tomorrow = baseDate.toISOString().split('T')[0];

export function getReadableDate(date: string) {
	switch (date) {
		case today:
			return 'Heute';
		case yesterday:
			return 'Gestern';
		case tomorrow:
			return 'Morgen';
		default:
			return new Date(date).toLocaleString(
				undefined,
				{
					year: "numeric",
					month: "2-digit",
					day: "numeric",
				},
			);
	}
}
