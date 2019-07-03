module.exports = version => {
	version = version === true ? 0 : typeof version === 'string' ? version.replace(/-.*$/, '') : version;

	return isNaN(version)
		? version === 'all'
			? 0
		: version
	: Number(version)
};