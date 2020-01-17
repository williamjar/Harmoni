import {CrewLeader} from "../../classes/crewLeader";

test('Crewleader constructor category', () => {
    expect(CrewLeader.getTestCrewLeader()[0].crewCategory).toBe('Lazy work');
});