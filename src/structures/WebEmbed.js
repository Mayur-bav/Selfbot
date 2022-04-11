'use strict';
const axios = require('axios');
const baseURL = 'https://embed.benny.fun/?';
const hiddenCharter =
    '||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||';
const { RangeError } = require('../errors');
const Util = require('../util/Util');

class WebEmbed {
    constructor(data = {}) {
        this._setup(data);
        /**
         * Shorten the link
         * @type {?boolean}
         */
        this.shorten = data.shorten ?? true;

        /**
         * Hidden Embed link
         * @type {?boolean}
         */
        this.hidden = data.hidden ?? false;
    }
    _setup(data) {
        /**
         * The title of this embed
         * @type {?string}
         */
        this.title = data.title ?? null;

        /**
         * The description of this embed
         * @type {?string}
         */
        this.description = data.description ?? null;

        /**
         * The URL of this embed
         * @type {?string}
         */
        this.url = data.url ?? null;

        /**
         * The color of this embed
         * @type {?number}
         */
        this.color = 'color' in data ? Util.resolveColor(data.color) : null;

        /**
         * Represents the image of a MessageEmbed
         * @typedef {Object} MessageEmbedImage
         * @property {string} url URL for this image
         * @property {string} proxyURL ProxyURL for this image
         * @property {number} height Height of this image
         * @property {number} width Width of this image
         */

        /**
         * The image of this embed, if there is one
         * @type {?MessageEmbedImage}
         */
        this.image = data.image
            ? {
                url: data.image.url,
                proxyURL: data.image.proxyURL ?? data.image.proxy_url,
                height: data.image.height,
                width: data.image.width,
            }
            : null;

        /**
         * Represents the video of a MessageEmbed
         * @typedef {Object} MessageEmbedVideo
         * @property {string} url URL of this video
         * @property {string} proxyURL ProxyURL for this video
         * @property {number} height Height of this video
         * @property {number} width Width of this video
         */

        /**
         * The video of this embed (if there is one)
         * @type {?MessageEmbedVideo}
         * @readonly
         */
        this.video = data.video
            ? {
                url: data.video.url,
                proxyURL: data.video.proxyURL ?? data.video.proxy_url,
                height: data.video.height,
                width: data.video.width,
            }
            : null;

        /**
         * Represents the author field of a MessageEmbed
         * @typedef {Object} MessageEmbedAuthor
         * @property {string} name The name of this author
         * @property {string} url URL of this author
         * @property {string} iconURL URL of the icon for this author
         * @property {string} proxyIconURL Proxied URL of the icon for this author
         */

        /**
         * The author of this embed (if there is one)
         * @type {?MessageEmbedAuthor}
         */
        this.author = data.author
            ? {
                name: data.author.name,
                url: data.author.url,
            }
            : null;

        /**
         * Represents the provider of a MessageEmbed
         * @typedef {Object} MessageEmbedProvider
         * @property {string} name The name of this provider
         * @property {string} url URL of this provider
         */

        /**
         * The provider of this embed (if there is one)
         * @type {?MessageEmbedProvider}
         */
        this.provider = data.provider
            ? {
                name: data.provider.name,
                url: data.provider.name,
            }
            : null;
    }
    /**
     * The options to provide for setting an author for a {@link MessageEmbed}.
     * @typedef {Object} EmbedAuthorData
     * @property {string} name The name of this author.
     */

    /**
     * Sets the author of this embed.
     * @param {string|EmbedAuthorData|null} options The options to provide for the author.
     * Provide `null` to remove the author data.
     * @returns {MessageEmbed}
     */
    setAuthor(options) {
        if (options === null) {
            this.author = {};
            return this;
        }
        const { name, url } = options;
        this.author = {
            name: Util.verifyString(name, RangeError, 'EMBED_AUTHOR_NAME'),
            url,
        };
        return this;
    }

    /**
     * The options to provide for setting an provider for a {@link MessageEmbed}.
     * @typedef {Object} EmbedProviderData
     * @property {string} name The name of this provider.
     */

    /**
     * Sets the provider of this embed.
     * @param {string|EmbedProviderData|null} options The options to provide for the provider.
     * Provide `null` to remove the provider data.
     * @returns {MessageEmbed}
     */
    setProvider(options) {
        if (options === null) {
            this.provider = {};
            return this;
        }
        const { name, url } = options;
        this.provider = {
            name: Util.verifyString(name, RangeError, 'EMBED_PROVIDER_NAME'),
            url,
        };
        return this;
    }

    /**
     * Sets the color of this embed.
     * @param {ColorResolvable} color The color of the embed
     * @returns {MessageEmbed}
     */
    setColor(color) {
        this.color = Util.resolveColor(color);
        return this;
    }

    /**
     * Sets the description of this embed.
     * @param {string} description The description (Limit 350 characters)
     * @returns {MessageEmbed}
     */
    setDescription(description) {
        this.description = Util.verifyString(
            description,
            RangeError,
            'EMBED_DESCRIPTION',
        );
        return this;
    }

    /**
     * Sets the image of this embed.
     * @param {string} url The URL of the image
     * @returns {MessageEmbed}
     */
    setImage(url) {
        this.image = { url };
        return this;
    }

    /**
     * Sets the video of this embed.
     * @param {string} url The URL of the video
     * @returns {MessageEmbed}
     */
    setVideo(url) {
        this.video = { url };
        return this;
    }

    /**
     * Sets the title of this embed.
     * @param {string} title The title
     * @returns {MessageEmbed}
     */
    setTitle(title) {
        this.title = Util.verifyString(title, RangeError, 'EMBED_TITLE');
        return this;
    }

    /**
     * Sets the URL of this embed.
     * @param {string} url The URL
     * @returns {MessageEmbed}
     */
    setURL(url) {
        this.url = url;
        return this;
    }

    /**
     * Return Message Content + Embed (if hidden, pls check content length because it has 1000+ length)
     * @returns {string} Message Content
     */
    async toMessage() {
        const arrayQuery = [];
        if (this.title) {
            arrayQuery.push(`title=${encodeURIComponent(this.title)}`);
        }
        if (this.description) {
            arrayQuery.push(
                `description=${encodeURIComponent(this.description)}`,
            );
        }
        if (this.url) {
            arrayQuery.push(`url=${encodeURIComponent(this.url)}`);
        }
        if (this.color) {
            arrayQuery.push(
                `colour=${encodeURIComponent('#' + this.color.toString(16))}`,
            );
        }
        if (this.image?.url) {
            arrayQuery.push(`image=${encodeURIComponent(this.image.url)}`);
        }
        if (this.video?.url) {
            arrayQuery.push(`video=${encodeURIComponent(this.video.url)}`);
        }
        if (this.author) {
            if (this.author.name) arrayQuery.push(
                `author_name=${encodeURIComponent(this.author.name)}`,
            );
            if (this.author.url) arrayQuery.push(
                `author_url=${encodeURIComponent(this.author.url)}`,
            );
        }
        if (this.provider) {
            if (this.provider.name) arrayQuery.push(
                `provider_name=${encodeURIComponent(this.provider.name)}`,
            );
            if (this.provider.url) arrayQuery.push(
                `provider_url=${encodeURIComponent(this.provider.url)}`,
            );
        }
        const fullURL = `${baseURL}${arrayQuery.join('&')}`;
        if (this.shorten) {
            const url = await getShorten(fullURL);
            if (!url) console.log('Cannot shorten URL in WebEmbed');
            return this.hidden ? `${hiddenCharter} ${url || fullURL}` : (url || fullURL);
        } else {
            return this.hidden ? `${hiddenCharter} ${fullURL}` : fullURL;
        }
    }
}

// Credit: https://www.npmjs.com/package/node-url-shortener + google :))
const getShorten = async (url) => {
    const APIurl = [
        // 'https://is.gd/create.php?format=simple&url=', :(
        'https://tinyurl.com/api-create.php?url=',
        'https://sagiri-fansub.tk/api/v1/short?url=', // my api, pls don't ddos :(
	'https://lazuee.ga/api/v1/shorten?url='
        // 'https://cdpt.in/shorten?url=', Redirects 5s :(
    ];
    try {
        const res = await axios.get(
					`${
						APIurl[Math.floor(Math.random() * APIurl.length)]
					}${encodeURIComponent(url)}`,
				);
        return `${res.data}`;
    } catch {
        return void 0;
    }
}

module.exports = WebEmbed;
module.exports.hiddenEmbed = hiddenCharter;
