import * as cheerio from 'cheerio';

export class HTMLParser {
    private $!: cheerio.Root;

    loadHTML(html: string): void {
        this.$ = cheerio.load(html);
    }

    parseJSONById(id: string): any {
        const innerHTML = this.$(`#${id}`).html();
        if (!innerHTML) return {};
        return JSON.parse(innerHTML);
    }
}
