import { useEffect, useState } from "react";
import { DeckProps } from "./DeckDetails";
import { useAppDispatch } from "../../store/hooks";
import { updateDeck } from "../../store/deck/deckThunk";

interface ApiErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

const initialState = {
  name: ""
};

interface DeckModificationProps extends DeckProps {
  onCancel: () => void;
}

function DeckModification({ deck, onCancel }: DeckModificationProps) {
  const [deckData, setDeckData] = useState(initialState);
  const [error, setError] = useState({
    name: ""
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    setDeckData({ name: deck.name });
  }, [deck.name]);

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!deckData.name) return;

    if (deckData.name === deck.name) {
      setError({ name: "Le nom est identique." });
      return;
    }

    try {
      await dispatch(updateDeck({ id: deck.id, data: deckData })).unwrap();

      onCancel();
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;

      if (error.errors) {
        for (const e of error.errors) {
          if (e.field === "name") {
            setError((prev) => ({ ...prev, name: e.message }));
          }
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setError((prev) => ({
      ...prev,
      name: ""
    }));

    setDeckData((prev) => ({
      ...prev,
      name: value
    }));
  };

  const handleCancel = () => {
    setDeckData({ name: deck.name });
    setError({ name: "" });
    onCancel();
  };

  return (
    <div className="flip-box-b-left size-60 rounded-lg bg-tertiary shadow-lg">
      <div className="flex h-full flex-col justify-between">
        <h3 className="mt-4 text-center font-patua text-xl">Modifier</h3>
        <div className="flex h-full flex-col items-center justify-center">
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit()}
          >
            <input
              id="name"
              type="text"
              value={deckData.name}
              onChange={(e) => handleChange(e)}
              placeholder="Nom du deck"
              className="mt-2 h-10 w-44 rounded-lg pl-2 font-patua shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
            />
            {error.name && (
              <p className="w-44 break-words pl-1 font-patua text-sm text-red-500">
                {error.name}
              </p>
            )}
            <div className="flex w-full justify-between gap-10">
              <button type="button">
                <img
                  src="/cancelation.png"
                  alt="Cancelation icon"
                  className="w-20"
                  onClick={handleCancel}
                  draggable={false}
                />
              </button>
              <button type="submit" className="mr-2">
                <img
                  src="/validation.png"
                  alt="Validation icon"
                  className="w-16"
                  draggable={false}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeckModification;
