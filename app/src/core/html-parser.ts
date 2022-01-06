import * as cheerio from 'cheerio';

export class HTMLParser {
    private $!: cheerio.Root;

    loadHTML(html: string): void {
        this.$ = cheerio.load(html);
    }

    parseJSONById(...ids: string[]): any {
        for (const id of ids) {
            const innerHTML = this.$(`#${id}`).html();
            if (innerHTML) return JSON.parse(innerHTML);
        }
        return {};
    }
}
