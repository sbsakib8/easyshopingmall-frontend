import SubCategoryProducts from "@/src/dropShipping/subCategoryProducts/subCategoryProducts";

const SubCategoryPage = async ({ params }) => {
  const { id } = await params;

  return (
    <>
      <SubCategoryProducts id={id} />
    </>
  );
};

export default SubCategoryPage;
