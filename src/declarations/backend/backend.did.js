export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'calculateAllocation' : IDL.Func(
        [IDL.Float64],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
