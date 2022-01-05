import { Button, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';
import { ProfileGroupViewData } from '@core/ProfileGroup';
import React from 'react';
interface Props {
    profileGroups: ProfileGroupViewData[];
}
const ProfileSelectDropdown: React.FunctionComponent<Props> = (props) => {
    const { profileGroups } = props;
    return (
        <div>
            <Menu isLazy>
                <MenuButton as={Button}>Profile</MenuButton>
                <MenuList>
                    {profileGroups.map((profileGroup) => {
                        return (
                            <>
                                <MenuGroup key={profileGroup.name} title={profileGroup.name}>
                                    {profileGroup.profiles.length
                                        ? profileGroup.profiles.map((profile) => (
                                              <MenuItem key={profile.profileName} isDisabled={profileGroup.profiles.length === 0}>
                                                  {profile.profileName}
                                              </MenuItem>
                                          ))
                                        : 'No profiles'}
                                </MenuGroup>
                                <MenuDivider key={profileGroup.name}></MenuDivider>
                            </>
                        );
                    })}
                </MenuList>
            </Menu>
        </div>
    );
};

export default ProfileSelectDropdown;
