const buildCiu = require('./lib/build-caniuse');
const buildMdn = require('./lib/build-mdn');
const fs = require('fs');

function updateCaniuseJson () {
	const ciuBrowserCompat = buildCiu();
	const ciuBrowserCompatJSON = JSON.stringify(ciuBrowserCompat);
	fs.writeFileSync('caniuse.json', ciuBrowserCompatJSON);
}

function updateMdnJson () {
	const mdnBrowserCompat = buildMdn();
	const mdnBrowserCompatFile = 'mdn.json';
	const mdnBrowserCompatJSON = JSON.stringify(mdnBrowserCompat);

	fs.writeFileSync(mdnBrowserCompatFile, mdnBrowserCompatJSON);

	const mdnSplitBrowserCompat = buildMdn(true);

	Object.keys(mdnSplitBrowserCompat).forEach(name => {
		const mdnBrowserCompatFile = `${name}.json`;
		const mdnBrowserCompatJSON = JSON.stringify(mdnSplitBrowserCompat[name]);

		fs.writeFileSync(mdnBrowserCompatFile, mdnBrowserCompatJSON);
	});
}

function updatePackageJson () {
	const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
	const { 'caniuse-lite': ciuVersion, 'mdn-browser-compat-data': mdnVersion } = pkg.devDependencies;

	const ciuVersionArray = ciuVersion.replace(/^[^\d]*/, '').split(/\./);
	const mdnVersionArray = mdnVersion.replace(/^[^\d]*/, '').split(/\./);

	const internalVersionArray = pkg['internal-version'].split(/\./).map(internalVersion => Number(internalVersion) || 0);
	const versionArray = internalVersionArray.map(
		(internalVersion, index) => {
			const ciuVersionNumber = Number(ciuVersionArray[index]) || 0;
			const mdnVersionNumber = Number(mdnVersionArray[index]) || 0;

			return internalVersion + ciuVersionNumber + mdnVersionNumber;
		}
	);

	const version = versionArray.join('.');

	pkg.version = version;

	const pkgJSON = `${JSON.stringify(pkg, null, '  ')}\n`;

	fs.writeFileSync('package.json', pkgJSON);
}

updateCaniuseJson();
updateMdnJson();
updatePackageJson();
