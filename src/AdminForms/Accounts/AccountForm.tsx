import Form from "react-bootstrap/Form"
import { UseFormReturn, Controller } from "react-hook-form"
import {
    FormHelperText,
    Select,
    MenuItem,
    FormControl,
    makeStyles,
    createStyles
} from '@material-ui/core'
import { MTextField } from "../../UI/Material/MTextField"

const useStyles = makeStyles(() => 
    createStyles({
        form: {
            marginBottom: '15px'
        }
    }))

export const AccountForm = (props: UseFormReturn) => {
    const styles = useStyles()
    const { control } = props

    return <>
        <FormControl className={styles.form} fullWidth>
            <MTextField
                name="nom"
                control={control}
                label="Nom"
                rules={{ required: 'Le nom est obligatoire' }}
            />
        </FormControl>
        <FormControl className={styles.form} fullWidth>
            <MTextField
                name="prenom"
                control={control}
                label="Prénom"
                rules={{ required: 'Le prénom est obligatoire' }}
            />
        </FormControl>
        <FormControl className={styles.form} fullWidth>
            <MTextField
                name="email"
                control={control}
                label="email"
                rules={{ required: "L'email est obligatoire" }}
            />
        </FormControl>
        <FormControl className={styles.form} fullWidth>
            <MTextField
                name="pass"
                control={control}
                label="Mot de passe"
            />
            <FormHelperText>Laisser vide pour ne pas modifier</FormHelperText>
        </FormControl>
        <FormControl className={styles.form} fullWidth>
            <Controller
                name="admin"
                control={control}
                defaultValue="false"
                render={({ field: { value, onChange } }) => (
                    <Select
                        labelId="role"
                        id="roles"
                        value={value}
                        onChange={onChange}
                    >
                        <MenuItem value="false">Utilisateur</MenuItem>
                        <MenuItem value="true">Administrateur</MenuItem>
                    </Select>
                )}
            />
        </FormControl>
    </>
}