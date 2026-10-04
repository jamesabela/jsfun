# Testing worksheet

A program accepts integer quantities from 2 to 12 inclusive and charges 4 each. Invalid values should cause re-entry.

Prepare normal, boundary and erroneous tests with expected results. Include a sequence of two invalid entries followed by a valid one. State separately whether conversion of non-numeric text is required. Classify a missing colon, an invalid list index during execution and a wrong multiplication factor.

## Model answers

Normal: 7 gives cost 28. Valid boundaries: 2 gives 8 and 12 gives 48. Just-outside values 1 and 13 are rejected. Sequence 1,13,7 must reject twice then give 28. Text `seven` should be rejected without a crash only if the requirement includes robust type handling; state that additional requirement. Error types are syntax, run-time and logic respectively. Record actual results after executing, then compare rather than substituting them for the expectations.
