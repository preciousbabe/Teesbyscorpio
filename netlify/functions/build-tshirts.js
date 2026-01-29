import fs from "fs";
import path from "path";

export const handler = async () => {
  const dir = path.join(process.cwd(), "content/tshirts");
  const files = fs.readdirSync(dir);

  const products = files.map(file => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");

    const data = {};
    raw
      .split("\n")
      .filter(l => l.includes(":"))
      .forEach(line => {
        const [key, ...rest] = line.split(":");
        data[key.trim()] = rest.join(":").trim();
      });

    return {
      name: data.name,
      price: Number(data.price),
      image: data.image,
      in_stock: data.in_stock !== "false"
    };
  });

  fs.writeFileSync(
    path.join(process.cwd(), "public/tshirts.json"),
    JSON.stringify(products, null, 2)
  );

  return {
    statusCode: 200,
    body: "T-shirts JSON built"
  };
};
