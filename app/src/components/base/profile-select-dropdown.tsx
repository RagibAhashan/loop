import { ProfileGroupViewData } from '@core/profilegroup';
import React from 'react';
interface Props {
    profileGroups: ProfileGroupViewData[];
}
const ProfileSelectDropdown: React.FunctionComponent<Props> = (props) => {
    const { profileGroups } = props;
    return <div>prof select drop down</div>;
};

export default ProfileSelectDropdown;
