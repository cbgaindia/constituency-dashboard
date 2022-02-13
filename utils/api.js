import { read, utils as xlsxUtil } from "xlsx";
import SchemesData from "utils/schemesData";

export async function fetchAPI(path) {
  const response = await fetch(
    `http://3.109.56.211/api/3/action/package_show?id=${path}`
  );
  const data = await response.json();
  return data;
}

export function generateSlug(slug) {
  if (slug) {
    const temp = slug.toLowerCase().replace(/\W/g, "-"); // lower case and replace space & special chars witn '-'
    return temp.replace(/-+/g, "-").replace(/-$/, ""); // remove multiple '-' and remove '-' from end of string
  }
  return null;
}

export async function fetchQuery(query, value) {
  const queryRes = await fetch(
    `http://3.109.56.211/api/3/action/package_search?fq=${query}:"${value}"+organization:constituency-wise-scheme-data&rows=50`
  ).then((res) => res.json());

  return queryRes.result.results;
}

export async function fetchSheets(link) {
  const result = [];
  await fetch(link)
    .then((res) => {
      if (!res.ok) throw new Error("fetch failed");
      return res.arrayBuffer();
    })
    .then((ab) => {
      const file = new Uint8Array(ab);
      const workbook = read(file, { type: "array" });

      workbook.SheetNames.forEach((bookName) => {
        const data = workbook.Sheets[bookName];

        const dataParse = xlsxUtil.sheet_to_json(data, {
          header: 1,
          blankrows: false,
        });
        result.push(dataParse);
      });
    });
  return result;
}

export async function dataTransform(id) {
  const obj = {
    ac: {},
    pc: {},
  };
  let name;
  let type;
  let slug;
  let acUrl;
  let pcUrl;
  await fetchQuery("slug", id).then((data) => {
    data[0].resources.forEach((file) => {
      if (file.url.includes("pc.xlsx")) pcUrl = file.url;
      else if (file.url.includes("ac.xlsx")) acUrl = file.url;
    });

    name = data[0].extras[0].value;
    type = data[0].extras[1].value;
    slug = data[0].name || "";
  });

  if (acUrl) {
    await fetchSheets(acUrl).then((res) => {
      const dataParse = res[0];
      const metaParse = res[1];
      let metaObj = {};

      // Meta Data
      metaParse.forEach((val) => {
        if (val[0]) {
          metaObj = {
            ...metaObj,
            [generateSlug(val[0])]: val[1],
          };
        }
      });

      obj.ac.metadata = {
        description: metaObj["scheme-description"] || "",
        name: name || "",
        frequency: metaObj.frequency || "",
        source: metaObj["data-source"] || "",
        type: type || "",
        note: metaObj["note:"] || "",
        slug,
        indicators: [],
      };

      // Tabular Data
      for (let i = 5; i < dataParse[0].length; i += 1) {
        let fiscal_year = {};
        const state_Obj = {};
        for (let j = 1; j < dataParse.length; j += 1) {
          if (!(dataParse[j][0] in state_Obj)){
              fiscal_year = {};};
          if (dataParse[j][4]) {
            fiscal_year[dataParse[j][4].trim()] = {
              ...fiscal_year[dataParse[j][4].trim()],
              [dataParse[j][3]]:
                Number.isNaN(parseFloat(dataParse[j][i])) ? "" : parseFloat(dataParse[j][i]).toFixed(2),
            };
          }
          state_Obj[dataParse[j][0]] = { ...fiscal_year };
        }
        const indicatorSlug =
          generateSlug(metaObj[`indicator-${i - 4}-name`]) || "";

        obj.ac.metadata.indicators.push(indicatorSlug);

        obj.ac.data = {
          ...obj.ac.data,
          [`indicator_0${i - 4}`]: {
            state_Obj,
            name: metaObj[`indicator-${i - 4}-name`] || "",
            description: metaObj[`indicator-${i - 4}-description`] || "",
            note: metaObj[`indicator-${i - 4}-note`] || "",
            slug: indicatorSlug,
            unit: metaObj[`indicator-${i - 4}-unit`] || "",
          },
        };
      }
    });
  }

  if (pcUrl) {
    await fetchSheets(pcUrl).then((res) => {
      const dataParse = res[0];
      const metaParse = res[1];
      let metaObj = {};

      // Meta Data
      metaParse.forEach((val) => {
        if (val[0]) {
          metaObj = {
            ...metaObj,
            [generateSlug(val[0])]: val[1],
          };
        }
      });

      obj.pc.metadata = {
        description: metaObj["scheme-description"] || "",
        name: name || "",
        frequency: metaObj.frequency || "",
        source: metaObj["data-source"] || "",
        type: type || "",
        note: metaObj["note:"] || "",
        slug,
        indicators: [],
      };

      // Tabular Data
      for (let i = 5; i < dataParse[0].length; i += 1) {
        let fiscal_year = {};
        const state_Obj = {};
        for (let j = 1; j < dataParse.length; j += 1) {
          if (!(dataParse[j][0] in state_Obj)){
              fiscal_year = {};};
          if (dataParse[j][4]) {
            fiscal_year[dataParse[j][4].trim()] = {
              ...fiscal_year[dataParse[j][4].trim()],
              [dataParse[j][3]]:
                Number.isNaN(parseFloat(dataParse[j][i])) ? "" : parseFloat(dataParse[j][i]).toFixed(2),
            };
          }
          state_Obj[dataParse[j][0]] = { ...fiscal_year };
        }

        const indicatorSlug =
          generateSlug(metaObj[`indicator-${i - 4}-name`]) || "";

        obj.pc.metadata.indicators.push(indicatorSlug);

        obj.pc.data = {
          ...obj.pc.data,
          [`indicator_0${i - 4}`]: {
            state_Obj,
            name: metaObj[`indicator-${i - 4}-name`] || "",
            description: metaObj[`indicator-${i - 4}-description`] || "",
            note: metaObj[`indicator-${i - 4}-note`] || "",
            slug: indicatorSlug,
            unit: metaObj[`indicator-${i - 4}-unit`] || "",
          },
        };
      }
    });
  }

  return obj;
}

export async function fetchNews(query) {
  const result = {};
  let link;
  await fetchQuery("schemeType", "news").then((newsLink) => {
    link = newsLink[0].resources[0].url;
  });
  await fetchSheets(link).then((res) => {
    const allNews = res[0];

    allNews.forEach((news, index) => {
      if (!index == 0) {
        const resultArr = {
          title: news[2] || "",
          text: news[3] || "",
          img: news[4] || "",
          accessed_on: news[5] || "",
          class: news[6] || "",
          link: news[7] || "",
        };

        if (result[news[0]]) {
          result[news[0]][result[news[0]].length] = resultArr;
        } else {
          result[news[0]] = [resultArr];
        }
      }
    });
  });

  const recentDevelopmentsArray = [];

  result[query].sort(
    (a, b) => new Date(b.accessed_on) - new Date(a.accessed_on)
  );

  if (result[query]) {
    while (result[query].length) {
      recentDevelopmentsArray.push(result[query].splice(0, 2));
    }
  }
  return recentDevelopmentsArray;
}

export async function fetchRelated(name, type) {
  const otherSchemes = [];
  await fetchQuery("schemeType", type).then((res) => {
    const similar = res
      .filter((scheme) => scheme.extras[0].value != name)
      .splice(0, 4);

    similar.forEach((scheme) => {
      otherSchemes.push({
        title: scheme.extras[0].value || "Scheme Name not defined",
        link: `/scheme/${scheme.extras[2].value || "#"}`,
        icon: SchemesData[scheme.extras[2].value].logo || "",
      });
    });
  });
  return otherSchemes;
}
