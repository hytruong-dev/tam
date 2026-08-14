import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "truyen-tranh" },
      update: {},
      create: { name: "Truyện tranh", slug: "truyen-tranh" },
    }),
    prisma.category.upsert({
      where: { slug: "tieu-thuyet" },
      update: {},
      create: { name: "Tiểu thuyết", slug: "tieu-thuyet" },
    }),
    prisma.category.upsert({
      where: { slug: "tam-ly-lang-man" },
      update: {},
      create: { name: "Tâm lý, Lãng mạn", slug: "tam-ly-lang-man" },
    }),
    prisma.category.upsert({
      where: { slug: "gia-tuong-ky-ao" },
      update: {},
      create: { name: "Giả tưởng, Kỳ ảo", slug: "gia-tuong-ky-ao" },
    }),
    prisma.category.upsert({
      where: { slug: "hanh-dong-phieu-luu" },
      update: {},
      create: { name: "Hành động, Phiêu lưu", slug: "hanh-dong-phieu-luu" },
    }),
  ]);

  const [manga, novel, romance, fantasy, action] = categories;

  // Placeholder images (picsum with consistent seeds)
  const imgs = [
    { url: "https://picsum.photos/seed/book1/400/600", path: null },
    { url: "https://picsum.photos/seed/book2/400/600", path: null },
    { url: "https://picsum.photos/seed/book3/400/600", path: null },
    { url: "https://picsum.photos/seed/book4/400/600", path: null },
    { url: "https://picsum.photos/seed/book5/400/600", path: null },
    { url: "https://picsum.photos/seed/book6/400/600", path: null },
    { url: "https://picsum.photos/seed/book7/400/600", path: null },
    { url: "https://picsum.photos/seed/book8/400/600", path: null },
    { url: "https://picsum.photos/seed/book9/400/600", path: null },
    { url: "https://picsum.photos/seed/book10/400/600", path: null },
    { url: "https://picsum.photos/seed/book11/400/600", path: null },
    { url: "https://picsum.photos/seed/book12/400/600", path: null },
  ];

  const products = [
    {
      name: "Bóng Tối Trong Mưa — Tập 1",
      slug: "bong-toi-trong-mua-tap-1",
      author: "Minh Hà",
      shortDescription: "Câu chuyện bí ẩn về một thám tử trẻ trong thành phố đầy sương mù.",
      description:
        "Trong một thành phố không bao giờ ngủ, thám tử Lê Minh Hà nhận một vụ án tưởng chừng đơn giản nhưng lại kéo anh vào mạng lưới tội ác đen tối. Bóng Tối Trong Mưa là hành trình đầy kịch tính qua những con hẻm tối tăm và những bí mật chôn sâu dưới mưa.",
      imageUrl: imgs[0].url,
      imagePath: imgs[0].path,
      price: 109000,
      originalPrice: 129000,
      stock: 45,
      categoryId: manga.id,
      isFeatured: true,
      isNew: false,
      isActive: true,
    },
    {
      name: "Hoa Dưới Trăng — Tập 2",
      slug: "hoa-duoi-trang-tap-2",
      author: "Trần Linh Chi",
      shortDescription: "Chuyện tình lãng mạn giữa hai tâm hồn cô đơn dưới ánh trăng.",
      description:
        "Hai con người lạc nhau giữa dòng đời hối hả tìm thấy nhau trong một đêm trăng rằm. Hoa Dưới Trăng là bản nhạc tình yêu ngọt ngào pha lẫn nỗi buồn man mác, khiến người đọc cảm nhận từng nhịp đập của trái tim.",
      imageUrl: imgs[1].url,
      imagePath: imgs[1].path,
      price: 119000,
      originalPrice: null,
      stock: 30,
      categoryId: romance.id,
      isFeatured: true,
      isNew: false,
      isActive: true,
    },
    {
      name: "Thành Phố Không Ngủ — Tập 1",
      slug: "thanh-pho-khong-ngu-tap-1",
      author: "Nguyễn Phong",
      shortDescription: "Hành trình sống sót của một nhóm trẻ giữa thành phố hỗn loạn.",
      description:
        "Khi hệ thống kiểm soát sụp đổ, thành phố rơi vào tình trạng hỗn độn. Một nhóm thanh niên phải liên kết lại để tồn tại qua những đêm dài không ngủ đầy nguy hiểm.",
      imageUrl: imgs[2].url,
      imagePath: imgs[2].path,
      price: 109000,
      originalPrice: 135000,
      stock: 60,
      categoryId: action.id,
      isFeatured: true,
      isNew: false,
      isActive: true,
    },
    {
      name: "Chú Thuật Hồi Chiến — Tập 3",
      slug: "chu-thuat-hoi-chien-tap-3",
      author: "Gege Akutami",
      shortDescription: "Trận chiến nghẹt thở giữa các phù thủy và lời nguyền cổ đại.",
      description:
        "Tập 3 của bộ manga đình đám mang đến loạt trận chiến khốc liệt khi Yuji cùng đồng đội đối mặt với hiểm nguy chưa từng có. Hành động nhanh, cảm xúc mãnh liệt.",
      imageUrl: imgs[3].url,
      imagePath: imgs[3].path,
      price: 119000,
      originalPrice: null,
      stock: 80,
      categoryId: manga.id,
      isFeatured: true,
      isNew: false,
      isActive: true,
    },
    {
      name: "Mùa Hoa Rơi Bên Hiên Nhà",
      slug: "mua-hoa-roi-ben-hien-nha",
      author: "Lê Phương Uyên",
      shortDescription: "Câu chuyện ký ức và tình yêu đầu đời trong căn nhà cũ.",
      description:
        "Khi trở về ngôi nhà xưa sau mười năm xa cách, Uyên tìm lại những ký ức về mùa hoa rơi và mối tình đầu chưa kịp nói lời chia tay. Tiểu thuyết lãng mạn thuần Việt đầy cảm xúc.",
      imageUrl: imgs[4].url,
      imagePath: imgs[4].path,
      price: 99000,
      originalPrice: 119000,
      stock: 25,
      categoryId: romance.id,
      isFeatured: true,
      isNew: false,
      isActive: true,
    },
    {
      name: "Lời Thì Thầm Của Rừng",
      slug: "loi-thi-tham-cua-rung",
      author: "Phạm Thảo Nguyên",
      shortDescription: "Hành trình khám phá khu rừng huyền bí nơi thiên nhiên có linh hồn.",
      description:
        "Một cô gái trẻ lạc vào khu rừng cổ thụ và phát hiện ra ngôn ngữ bí ẩn của tự nhiên. Câu chuyện kỳ ảo mang đậm chất thơ và triết học về mối quan hệ giữa con người và đất đai.",
      imageUrl: imgs[5].url,
      imagePath: imgs[5].path,
      price: 95000,
      originalPrice: null,
      stock: 40,
      categoryId: fantasy.id,
      isFeatured: true,
      isNew: false,
      isActive: true,
    },
    {
      name: "Ký Ức Dưới Ánh Sao — Tập 1",
      slug: "ky-uc-duoi-anh-sao-tap-1",
      author: "Hoàng Minh Tuấn",
      shortDescription: "Hành trình tìm lại ký ức trong thế giới tương lai đầy bí ẩn.",
      description:
        "Năm 2087, con người có thể mua bán ký ức. Kai là thám tử chuyên điều tra những vụ ký ức bị đánh cắp, cho đến khi anh phát hiện ra bí mật về chính bản thân mình.",
      imageUrl: imgs[6].url,
      imagePath: imgs[6].path,
      price: 109000,
      originalPrice: 130000,
      stock: 35,
      categoryId: novel.id,
      isFeatured: false,
      isNew: true,
      isActive: true,
    },
    {
      name: "Đóa Hoa Không Tên — Tập 1",
      slug: "doa-hoa-khong-ten-tap-1",
      author: "Sakura Yamamoto",
      shortDescription: "Mối tình không tên giữa hai người lạ chạm nhau tình cờ.",
      description:
        "Hai người hoàn toàn khác nhau, một cuộc gặp gỡ tình cờ và cảm xúc không ai ngờ tới. Đóa Hoa Không Tên là bộ manga lãng mạn ngọt ngào về những điều giản dị nhất của tình yêu.",
      imageUrl: imgs[7].url,
      imagePath: imgs[7].path,
      price: 105000,
      originalPrice: null,
      stock: 50,
      categoryId: romance.id,
      isFeatured: false,
      isNew: true,
      isActive: true,
    },
    {
      name: "Bình Minh Sau Bão — Tập 1",
      slug: "binh-minh-sau-bao-tap-1",
      author: "Nguyễn Thị Lan",
      shortDescription: "Câu chuyện sinh tồn và hy vọng sau thảm họa thiên nhiên.",
      description:
        "Sau trận siêu bão tàn phá, một cộng đồng nhỏ phải xây dựng lại cuộc sống từ đầu. Bình Minh Sau Bão là câu chuyện về sức mạnh con người khi đối mặt với nghịch cảnh tột cùng.",
      imageUrl: imgs[8].url,
      imagePath: imgs[8].path,
      price: 115000,
      originalPrice: 140000,
      stock: 20,
      categoryId: action.id,
      isFeatured: false,
      isNew: true,
      isActive: true,
    },
    {
      name: "Nhật Ký Của Gió — Tập 1",
      slug: "nhat-ky-cua-gio-tap-1",
      author: "Trần Bảo Châu",
      shortDescription: "Nhật ký kể về những chuyến đi và con người gặp gỡ dọc đường.",
      description:
        "Những trang nhật ký viết tay ghi lại cuộc hành trình xuyên Việt một mình của một cô gái 22 tuổi. Mỗi trang sách là một vùng đất, một câu chuyện, một bài học về cuộc sống.",
      imageUrl: imgs[9].url,
      imagePath: imgs[9].path,
      price: 95000,
      originalPrice: null,
      stock: 65,
      categoryId: novel.id,
      isFeatured: false,
      isNew: true,
      isActive: true,
    },
    {
      name: "Dứa Trẻ Và Mặt Trăng — Tập 1",
      slug: "dua-tre-va-mat-trang-tap-1",
      author: "Lee Min Ho",
      shortDescription: "Câu chuyện giả tưởng về một đứa trẻ sinh ra dưới ánh trăng rằm.",
      description:
        "Trong thế giới nơi ánh trăng ban phép màu, cậu bé Moon được sinh ra với khả năng đặc biệt. Hành trình trưởng thành của Moon là bức tranh kỳ diệu pha trộn giữa phép thuật và tình thân.",
      imageUrl: imgs[10].url,
      imagePath: imgs[10].path,
      price: 99000,
      originalPrice: 120000,
      stock: 55,
      categoryId: fantasy.id,
      isFeatured: false,
      isNew: true,
      isActive: true,
    },
    {
      name: "Gương Vỡ Lại Lành — Tập 1",
      slug: "guong-vo-lai-lanh-tap-1",
      author: "Kim Soo Ah",
      shortDescription: "Hành trình chữa lành của một tâm hồn bị tổn thương sâu sắc.",
      description:
        "Sau biến cố lớn, Ji Won phải học lại cách yêu thương bản thân và tin tưởng vào người khác. Gương Vỡ Lại Lành là câu chuyện chữa lành đầy cảm xúc về sức mạnh của sự tha thứ.",
      imageUrl: imgs[11].url,
      imagePath: imgs[11].path,
      price: 105000,
      originalPrice: null,
      stock: 38,
      categoryId: romance.id,
      isFeatured: false,
      isNew: false,
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`✅ Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
