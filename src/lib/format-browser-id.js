const supportedBrowsers = {
	and_chr: 'and_chr',
	and_ff: 'and_ff',
	and_qq: 'and_qq',
	and_uc: 'and_uc',
	android: 'android',
	baidu: 'baidu',
	bb: 'bb',
	chrome: 'chrome',
	edge: 'edge',
	edge_mob: 'edge_mob',
	ff: 'ff',
	ie: 'ie',
	ie_mob: 'ie_mob',
	ios: 'ios',
	kaios: 'kaios',
	node: 'node',
	op_mini: 'op_mini',
	op_mob: 'op_mob',
	opera: 'opera',
	safari: 'safari',
	samsung: 'samsung',
};

const remappableBrowsers = {
	blackberry: 'bb',
	chrome_android: 'and_chr',
	chromeandroid: 'and_chr',
	edge_mobile: 'edge_mob',
	explorer: 'ie',
	explorermobile: 'ie_mob',
	firefox_android: 'and_ff',
	firefoxandroid: 'and_ff',
	firefox: 'ff',
	ios_saf: 'ios',
	nodejs: 'node',
	opera_android: 'and_chr',
	operamini: 'op_mini',
	operamobile: 'op_mob',
	qq_android: 'and_qq',
	qqandroid: 'and_qq',
	safari_ios: 'ios_saf',
	samsunginternet_android: 'samsung',
	uc_android: 'and_uc',
	uc_chinese_android: 'and_uc',
	ucandroid: 'and_uc',
	webview_android: 'android',
};

const browserMap = Object.assign(
	Object.create(null),
	supportedBrowsers,
	remappableBrowsers
);

module.exports = id => {
	id = String(id).toLowerCase();

	if (id in browserMap) {
		id = browserMap[id];

		return id;
	}
};
