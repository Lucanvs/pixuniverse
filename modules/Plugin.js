class Plugin {
	constructor(props) {
		this.name = props.name;
		this.version = props.version;
		this.install = props.install;
		this.onload = props.onload;
		this.filename = props.file;
		this.took = props.took;
		this.loaded = props.loaded;
	};
};

module.exports = Plugin;