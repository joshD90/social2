import { useParams } from "react-router-dom";
import {
  TCategoryInfo,
  TCategoryNames,
} from "../../types/categoryTypes/CategoryTypes";
import { useEffect, useState } from "react";
import { categoryDescription } from "../../assets/category/categoryInfo";

const CategoryLanding = () => {
  const { category } = useParams();
  const [categoryInfo, setCategoryInfo] = useState<TCategoryInfo | null>(null);

  useEffect(() => {
    const catDescription = categoryDescription.get(category as TCategoryNames);
    catDescription ? setCategoryInfo(catDescription) : setCategoryInfo(null);
  }, [category]);

  if (!categoryInfo) return <>some text to keep you happy</>;
  return (
    <section
      style={{
        background: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${categoryInfo.image})`,
      }}
      className="w-full h-full bg-cover text-center p-5 text-stone-50"
    >
      <h1 className="text-4xl my-5">{categoryInfo.name}</h1>
      <div className="w-4/5 text-center ml-auto mr-auto">
        {categoryInfo.info.map((infoPar) => (
          <p className="mt-5">{infoPar}</p>
        ))}
      </div>
    </section>
  );
};

export default CategoryLanding;
