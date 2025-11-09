// data/vendors.js
// توجه: اسلاگ‌ها استاندارد و کوچک‌حرف باشند تا با URL /products/<slug> یکسان شوند.

const vendors = [
  {
    title: "Dell EMC",
    slug: "dell",
    products: [
      {
        title: "PowerEdge R7x",
        brand: "Dell EMC",
        image: "/products/dell/poweredge-r7x.webp",
        desc: "سرور نسل ۱۵/۱۶ مناسب مجازی‌سازی و دیتابیس با iDRAC و PCIe Gen4/Gen5.",
        spec: "/specs/dell/poweredge-r7x.pdf",
      },
      {
        title: "Unity XT",
        brand: "Dell EMC",
        image: "/products/dell/unity-xt.webp",
        desc: "آرایه‌ی NAS/SAN با Snapshot/Replication و Cloud Tiering.",
        spec: "/specs/dell/unity-xt.pdf",
      },
      {
        title: "PowerStore T",
        brand: "Dell EMC",
        image: "/products/dell/powerstore-t.webp",
        desc: "آرایه‌ی All-Flash با NVMe و Scale-Up/Scale-Out.",
        spec: "/specs/dell/powerstore-t.pdf",
      },
    ],
  },

  {
    title: "HPE",
    slug: "hpe",
    products: [
      // محصولات HPE …
    ],
  },

  {
    title: "Lenovo",
    slug: "lenovo",
    products: [
      // محصولات Lenovo …
    ],
  },

  {
    title: "Cisco",
    slug: "cisco",
    products: [
      // محصولات Cisco …
    ],
  },

  {
    title: "Juniper",
    slug: "juniper",
    products: [
      // محصولات Juniper …
    ],
  },

  {
    title: "Quantum",
    slug: "quantum",
    products: [
      // محصولات Quantum …
    ],
  },

  // ────────────── برندهای جدید ──────────────
  {
    title: "Brocade",
    slug: "brocade",
    products: [
      // در صورت نیاز بعداً اضافه کن
    ],
  },
  {
    title: "Hitachi",
    slug: "hitachi",
    products: [
      // …
    ],
  },
  {
    title: "Palo Alto",
    slug: "paloalto", // اسلاگ یکپارچه و بدون فاصله
    products: [
      // …
    ],
  },
  {
    title: "F5",
    slug: "f5",
    products: [
      // …
    ],
  },
  {
    title: "Fortinet",
    slug: "fortinet", // «Forti» بهتره به «Fortinet» کامل باشه
    products: [
      // …
    ],
  },
  {
    title: "Oracle",
    slug: "oracle",
    products: [
      // …
    ],
  },
];

export default vendors;