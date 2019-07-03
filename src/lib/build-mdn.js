const formatBrowserId = require('./format-browser-id');
const formatVersionNumber = require('./format-version-number');
const mdnData = require('mdn-browser-compat-data');

module.exports = shouldSplitPrimarySections => {
	const matchWhetherKeyShouldBeUsed = /^(browsers|http|webdriver|webextensions|xpath|xslt)$/;
	const getWhetherKeyShouldBeMatched = key => !matchWhetherKeyShouldBeUsed.test(key);

	const features = Object.keys(mdnData).filter(getWhetherKeyShouldBeMatched).sort().reduce(
		(exportedFeatures, sectionId) => {
			const importedSection = mdnData[sectionId];

			sectionId = getFormattedSectionId(sectionId);

			if (shouldSplitPrimarySections) {
				if (!(sectionId in exportedFeatures)) {
					exportedFeatures[sectionId] = Object.create(null);
				}

				forEachSection(importedSection, []);
			} else {
				forEachSection(importedSection, [sectionId]);
			}

			return exportedFeatures;

			function forEachSection (importedSection, sectionIds) {
				Object.keys(importedSection).sort().forEach(
					featureId => {
						const importedFeature = importedSection[featureId];
						const featureNames = sectionIds.concat(featureId);

						const isFeatureAnObject = importedFeature === Object(importedFeature);

						if (isFeatureAnObject) {
							const doesFeatureHaveSupportData = '__compat' in importedFeature;

							if (doesFeatureHaveSupportData) {
								const featureName = featureNames.join('.');
								const support = getSupportFromCompat(importedFeature.__compat);

								if (shouldSplitPrimarySections) {
									exportedFeatures[sectionId][featureName] = support;
								} else {
									exportedFeatures[featureName] = support;
								}
							}

							forEachSection(importedFeature, featureNames);
						}
					}
				);
			}
		},
		Object.create(null)
	);

	return features;
};

const formattedSectionIds = {
	javascript: 'js'
};

function getFormattedSectionId (sectionId) {
	return formattedSectionIds[sectionId] || sectionId
}

function getSupportFromCompat (compat) {
	const { support } = compat;
	const isSupportAnObject = support === Object(support);
	const supportKeys = isSupportAnObject ? Object.keys(support) : [];

	if (!supportKeys.length) {
		return null;
	}

	return supportKeys.sort().reduce(
		(browsers, browserId) => {
			const { version_added, version_removed } = support[browserId];

			const isFeatureMoreRecentlyRemoved = !version_added || version_removed > version_added;

			if (isFeatureMoreRecentlyRemoved) {
				return browsers;
			}

			browserId = formatBrowserId(browserId);

			if (browserId) {
				const version = formatVersionNumber(version_added);

				browsers[browserId] = version;
			}

			return browsers;
		},
		{}
	);
}
