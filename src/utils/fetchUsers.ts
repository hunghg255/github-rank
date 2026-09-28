import FS from 'fs-extra';
import path from 'path';
import { getUserData, sleep } from './index.js';
import { UsersDataBase } from '../common/props.js';

/**
 * Fetch up to 10 pages (the Search API caps results at 1000) and write the
 * de-duplicated list to `.cache/<filename>`. Stops early once a page is short.
 */
export async function fetchUsers(filename: string, isVietnam?: boolean) {
  try {
    let users: UsersDataBase[] = [];
    for (let page = 1; page <= 10; page++) {
      const data = await getUserData(page, isVietnam);
      users = users.concat(data);
      console.log(`-> 获取到第${page}页，${isVietnam ? '越南用户' : ''}共\x1b[32;1m${data.length}\x1b[0m条数据！`);
      if (data.length < 100) break;
      await sleep(2500);
    }

    // 数据去重
    const seen: Record<string, boolean> = {};
    const result = users
      .filter((item) => (seen[item.login] ? false : (seen[item.login] = true)))
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    FS.outputFileSync(path.join(process.cwd(), '.cache', filename), JSON.stringify(result, null, 2));
    console.log(`-> 共获取\x1b[32;1m${result.length}\x1b[0m条用户数据！`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
