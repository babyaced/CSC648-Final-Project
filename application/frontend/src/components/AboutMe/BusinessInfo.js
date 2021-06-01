import React from 'react'

import styles from './BusinessInfo.module.css'

//import UI Components
import EditButton from '../Buttons/EditButton'

function BusinessInfo({hoursState, displayEditHoursModal, displayEditAddressModal, isSelfView, labelSelected, phone, phoneSetter, submitPhoneEdit, location, changing, changingInfoHandler, cancelEditingHandler}) {
    console.log("phone: ", phone)
    return (
    <div className={styles['business-info-container']}>
        {
            isSelfView && (labelSelected !== 'address') && 
            <EditButton edit clicked={() => displayEditAddressModal()}>Edit</EditButton>
        }
        <label for="tab-address">Address: </label>
        <textarea 
            id="tab-address"
            value={location} 
            readOnly={!changing || !(labelSelected === 'address')}
            className={styles.AddressTextArea}
        />
        {
            isSelfView && (labelSelected !== 'phone number') && 
            <EditButton edit clicked={() => changingInfoHandler('phone number')}>Edit</EditButton>
        }
        <label for="phone" >Phone Number: </label>
        <input 
            id="phone"
            type="tel" 
            // value={`(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6,10)}`} 
            value={phone}
            readOnly={!changing || !(labelSelected === 'phone number')}
            maxLength = "10"
            onKeyPress={event => {
                if(event.key === 'Enter'){
                    cancelEditingHandler();
                }
              }}
            onChange={event => phoneSetter(event.target.value)} 
        />
        {
            (labelSelected === 'phone number') && 
            <EditButton save clicked={() => {
                cancelEditingHandler();
                submitPhoneEdit();
            }}>Save</EditButton> 
        }
        <div className={styles.HoursDiv} >
            <div>
                {
                    isSelfView && (labelSelected !== 'hours') && 
                    <EditButton edit clicked={() => {
                        displayEditHoursModal();
                        changingInfoHandler('hours')
                        }}
                    >
                        Edit
                    </EditButton>
                }
                <label>Hours: </label>
            </div>
            <table className={styles['hours-table']} >
                {Object.keys(hoursState).map((key, index) => {
                    if (index % 2 === 1)
                        return null;
                    
                    let day = key.substr(0, 3);
            
                    return <tr className={styles['hours-table-row']} key={key}>
                        <th className={styles['hours-table-header']} >{day[0].toUpperCase() + day.substring(1)}: </th>                              
                        <td className={styles['hours-table-cell']}>{hoursState[key].value !== "00:00:00" ? <span >{hoursState[key].label + " - " + hoursState[day +'_close'].label}</span> : <span>Closed</span>}</td>
                    </tr>
                })}
            </table>
        </div>
    </div>
    )
}

export default BusinessInfo
