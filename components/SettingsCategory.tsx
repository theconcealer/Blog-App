import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'


// Props type listing
type Props = {
    category: string,
    icon: keyof typeof Ionicons.glyphMap,
    name1: string,
    name2: string,
}

const SettingsCategory = (props: Props) => {
    return (
        <View>
            {/* Settings category name */}
            <View style={styles.categoryDetail}>
                <Ionicons name={props.icon} size={20} color={'#0748c9'} />
                <Text style={styles.detailText}>{props.category}</Text>
            </View>

            {/* Category content holder */}
            <View style={styles.detailsHolder}>
                <TouchableOpacity>
                    <View style={styles.detail1}>
                        <Text>{props.name1}</Text>
                        <Ionicons name='chevron-forward-outline' size={16} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity>
                    <View style={styles.detail2}>
                        <Text>{props.name2}</Text>
                        <Ionicons name='chevron-forward-outline' size={16} />
                    </View>
                </TouchableOpacity>

            </View>







        </View>
    )
}

export default SettingsCategory

const styles = StyleSheet.create({
    categoryDetail: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginTop: 48,
    },

    detailText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 400,
        color: '#1e1e1e'
    },

    detailsHolder: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#cedeef',
        borderRadius: 8,
    },

    detail1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },

    detail2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
    }
})