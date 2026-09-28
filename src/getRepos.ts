import { sleep, getReposData } from './utils/index.js';
import { RepoData } from './common/props.js';
import { saveData } from './utils/saveData.js';

;(async() => {
  try {
    let repos: RepoData[] = [];
    for (let page = 1; page <= 10; page++) {
      const data = await getReposData(page);
      repos = repos.concat(data);
      console.log(`> 获取到第${page}页，共\x1b[32;1m${data.length}\x1b[0m条数据！`);
      if (data.length < 100) break;
      await sleep(2500);
    }
    await saveData(repos, 'repos.json');
    console.log(`> 共获取 ${repos.length} 个仓库！`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
