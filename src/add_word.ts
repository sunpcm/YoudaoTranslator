import redaxios from './libs/redaxios';
declare var tjs: any;

class EudicWordBook {
    private token;

    constructor(token) {
        this.token = token;
    }

    async add(word: string) {
        if (!this.token) {
            // EudicWordBook.notify("配置失败：请在 Workflow 环境变量中添加 eudic_token");
            return;
        }

        try {
            const success = await this.pushWord(word);
            if (success) {
                // do nothing on success to avoid piping text into `say` node
            } else {
                // do nothing
            }
        } catch (e: any) {
            let errorMsg = e.message || e.toString();
            if (e.data) {
                errorMsg += ' ' + JSON.stringify(e.data);
            }
            // do not log errors to avoid piping into `say`
        }
    }

    private async pushWord(word: string): Promise<boolean> {
        const url = 'https://api.frdic.com/api/open/v1/studylist/words';
        
        // 欧路官方要求 Authorization 是 'NIS xxxx' 格式
        let authHeader = this.token.trim();
        if (!authHeader.startsWith('NIS ')) {
            authHeader = 'NIS ' + authHeader;
        }
        
        const response = await redaxios.post(url, {
            "category_id": "0",
            "language": "en",
            "words": [word]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (response.status === 201 || response.status === 200) {
           return true; 
        }
        return false;
    }
}

const main = async () => {
    // 改为读取欧路的授权 token 环境变量： 'eudic_token'
    const wb = new EudicWordBook(tjs.getenv('eudic_token'));

    const word: string = Array.from(tjs.args).pop() as string;

    await wb.add(word);
}

main();