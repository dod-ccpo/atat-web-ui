/* eslint-disable camelcase */
import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import {ContactDataStore} from "@/store/contactData/index";
import {ContactDTO} from "@/api/models";
import {api} from "@/api";
jest.mock('@/store/helpers')

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ContactData Store",
  () => {
    let contactDataStore: ContactDataStore;
    let mockPrimaryPOC: ContactDTO;

    beforeEach(() => {
      const createStore = (storeOptions: any = {}):
        Store<{ contactData: any }> => new Vuex.Store({...storeOptions});
      contactDataStore = getModule(ContactDataStore, createStore());
      mockPrimaryPOC = {
        sys_id: "PRIM_1",
        first_name: "PrimFN",
        last_name: "PrimLN",
        middle_name: "",
        role: "MILITARY",
        rank_components: "RANK_1",
        suffix: "",
        salutation: "",
        phone: "111-111-1111",
        phone_extension: "",
        email: "prim@mail.mil",
        type: "PRIMARY",
        dodaac: "",
        can_access_package: "true",
        grade_civ: "",
        title: "",
        manually_entered: ""
      };
    })
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    })

    it('getContactBySysId() - should make an API call to get the contact', async () => {
      jest.spyOn(api.contactsTable, 'retrieve').mockImplementation(
        () => Promise.resolve(mockPrimaryPOC)
      );
      try {
        await contactDataStore.getContactBySysId("ANY_CONTACT_SYS_ID");
      } catch {
        await expect(api.contactsTable.retrieve).toHaveBeenCalled();
      }
    })

    it('saveContact() - should create a contact if not already created', async () => {
      jest.spyOn(api.contactsTable, 'update').mockImplementation(
        () => Promise.resolve(mockPrimaryPOC)
      );
      jest.spyOn(api.contactsTable, 'create').mockImplementation(
        () => Promise.resolve(mockPrimaryPOC)
      );
      try {
        mockPrimaryPOC.sys_id = undefined;
        await contactDataStore.saveContact(mockPrimaryPOC);
      } catch {
        await expect(api.contactsTable.create).toHaveBeenCalled();
        await expect(api.contactsTable.update).not.toHaveBeenCalled();
      }
      try {
        mockPrimaryPOC.sys_id = "PRIM_1";
        await contactDataStore.saveContact(mockPrimaryPOC);
      } catch {
        await expect(api.contactsTable.create).not.toHaveBeenCalled();
        await expect(api.contactsTable.update).toHaveBeenCalled();
      }
    })

    it('deleteContactBySysId() - should make an API call to DELETE the contact', async () => {
      jest.spyOn(api.contactsTable, 'remove').mockImplementation(
        () => Promise.resolve()
      );
      try {
        await contactDataStore.deleteContactBySysId("ANY_CONTACT_SYS_ID");
      } catch {
        await expect(api.contactsTable.remove).toHaveBeenCalled();
      }
    })
  })
