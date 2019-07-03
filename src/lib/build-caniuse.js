const caniuseData = require('caniuse-lite');
const formatBrowserId = require('./format-browser-id');
const formatVersionNumber = require('./format-version-number');

module.exports = () => {
	const features = Object.keys(caniuseData.features).sort().reduce(
		(exportedFeatures, featureId) => {
			const feature = caniuseData.feature(caniuseData.features[featureId]);

			const stats = Object.keys(feature.stats).sort().reduce(
				(stats, browserId) => {
					const stat = feature.stats[browserId];

					const version = formatVersionNumber(Object.keys(stat).filter(version => stat[version][0] === 'y').sort(
						(a, b) => {
							a = formatVersionNumber(a)
							b = formatVersionNumber(b)

							if (!isNaN(a) && isNaN(b)) return -1
							if (isNaN(a) && !isNaN(b)) return 1

							return a - b
						}
					).shift())

					const isVersionVoid = version === null || version === undefined;

					if (!isVersionVoid) {
						stats = stats || {};

						browserId = formatBrowserId(browserId);

						if (browserId) {
							stats[browserId] = version;
						}
					}

					return stats;
				},
				null
			);

			const isFeatureValid = featureId !== 'testfeat' && stats !== null;

			if (isFeatureValid) {
				const support = stats;
				// const status = feature.status;

				exportedFeatures[featureId] = support;
			}

			return exportedFeatures;
		},
		{}
	);

	return features;
};
