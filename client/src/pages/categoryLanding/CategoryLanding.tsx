import { useParams, useNavigate } from "react-router-dom";
import {
  TCategoryInfo,
  TCategoryNames,
} from "../../types/categoryTypes/CategoryTypes";
import { useEffect, useState } from "react";
import { categoryDescription } from "../../assets/category/categoryInfo";

const CategoryLanding = () => {
  const { category } = useParams();
  const [categoryInfo, setCategoryInfo] = useState<TCategoryInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const catDescription = categoryDescription.get(category as TCategoryNames);
    catDescription ? setCategoryInfo(catDescription) : setCategoryInfo(null);
  }, [category]);

  //if no category has been selected then we send back our generic categories homepage - may need to break this into a seperate component perhaps
  if (!categoryInfo)
    return (
      <div className="w-full h-full relative flex flex-col justify-center">
        <button
          className="p-2 bg-green-500 rounded-md hover:bg-green-400 absolute left-2 top-2"
          onClick={() => navigate("/services")}
        >
          Back
        </button>
      </div>
    );
  //if there is a category selected then we feed in the category information may need to break this into a seperate component
  return (
    <section
      style={{
        background: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.5)), url(${categoryInfo.image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full h-full bg-cover text-center p-5 text-stone-50 relative bg-no-repeat"
    >
      <button
        className="p-2 bg-green-500 rounded-md hover:bg-green-400 absolute left-2 "
        onClick={() => navigate("/services")}
      >
        Back
      </button>
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
